from fastapi.testclient import TestClient

from app import main


def test_invalid_decision_status_is_rejected():
    client = TestClient(main.app)

    response = client.post(
        "/decisions",
        json={
            "record_id": 11,
            "recommendation_id": 7,
            "selected_action": "Air Freight",
            "decision_status": "EXECUTED",
        },
    )

    assert response.status_code == 422


def test_invalid_decision_ids_are_rejected_before_database_access():
    client = TestClient(main.app)

    response = client.post(
        "/decisions",
        json={
            "record_id": 0,
            "recommendation_id": 0,
            "selected_action": "Air Freight",
        },
    )

    assert response.status_code == 422


def test_database_connection_failure_is_reported(monkeypatch):
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
