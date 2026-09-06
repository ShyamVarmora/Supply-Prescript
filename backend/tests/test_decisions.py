from fastapi.testclient import TestClient

from app import main


class FakeCursor:
    def __init__(self, record=None, recommendation=None):
        self.record = record
        self.recommendation = recommendation
        self.executed = []
        self.closed = False
        self.lastrowid = 42

    def execute(self, query, params):
        self.executed.append((query, params))

    def fetchone(self):
        query = self.executed[-1][0]
        if "FROM supply_chain_data" in query:
            return self.record
        return self.recommendation

    def close(self):
        self.closed = True


class FakeConnection:
    def __init__(self, record=None, recommendation=None):
        self.cursor_instance = FakeCursor(record, recommendation)
        self.commits = 0
        self.rollbacks = 0
        self.closed = False

    def cursor(self, dictionary=False):
        return self.cursor_instance

    def commit(self):
        self.commits += 1

    def rollback(self):
        self.rollbacks += 1

    def is_connected(self):
        return not self.closed

    def close(self):
        self.closed = True


def make_client(monkeypatch, connection):
    monkeypatch.setattr(main, "get_db_connection", lambda: connection)
    return TestClient(main.app)


def recommendation():
    return {
        "recommendation_id": 7,
        "record_id": 11,
        "action": "Air Freight",
        "action_cost": 125.0,
    }


def test_valid_decision_inserts_and_commits(monkeypatch):
    connection = FakeConnection({"record_id": 11}, recommendation())
    client = make_client(monkeypatch, connection)

    response = client.post(
        "/decisions",
        json={
            "record_id": 11,
            "recommendation_id": 7,
            "selected_action": "Air Freight",
        },
    )

    assert response.status_code == 200
    assert response.json()["decision_id"] == 42
    assert connection.commits == 1
    assert connection.rollbacks == 0
    assert connection.cursor_instance.executed[-1][1] == (
        11,
        7,
        "Air Freight",
        125.0,
        None,
        None,
        "SELECTED",
    )


def test_invalid_record_id_does_not_insert(monkeypatch):
    connection = FakeConnection(None, recommendation())
    client = make_client(monkeypatch, connection)

    response = client.post(
        "/decisions",
        json={
            "record_id": 999,
            "recommendation_id": 7,
            "selected_action": "Air Freight",
        },
    )

    assert response.status_code == 404
    assert connection.commits == 0
    assert len(connection.cursor_instance.executed) == 1


def test_invalid_recommendation_id_does_not_insert(monkeypatch):
    connection = FakeConnection({"record_id": 11}, None)
    client = make_client(monkeypatch, connection)

    response = client.post(
        "/decisions",
        json={
            "record_id": 11,
            "recommendation_id": 999,
            "selected_action": "Air Freight",
        },
    )

    assert response.status_code == 404
    assert connection.commits == 0
    assert len(connection.cursor_instance.executed) == 2


def test_invalid_selected_action_does_not_insert(monkeypatch):
    connection = FakeConnection({"record_id": 11}, recommendation())
    client = make_client(monkeypatch, connection)

    response = client.post(
        "/decisions",
        json={
            "record_id": 11,
            "recommendation_id": 7,
            "selected_action": "Unapproved Action",
        },
    )

    assert response.status_code == 422
    assert connection.commits == 0
    assert len(connection.cursor_instance.executed) == 2


def test_database_error_returns_service_error(monkeypatch):
    def fail_connection():
        raise RuntimeError("Database connection failed")

    monkeypatch.setattr(main, "get_db_connection", fail_connection)
    client = TestClient(main.app)

    response = client.post(
        "/decisions",
        json={
            "record_id": 11,
            "recommendation_id": 7,
            "selected_action": "Air Freight",
        },
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Database connection failed"