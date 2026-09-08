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


def test_outcome_requires_at_least_one_actual_value():
    client = TestClient(main.app)

    response = client.post(
        "/decisions/11/outcome",
        json={},
    )

    assert response.status_code == 422


def test_outcome_rejects_negative_values_before_database_access():
    client = TestClient(main.app)

    response = client.post(
        "/decisions/11/outcome",
        json={"actual_cost": -1},
    )

    assert response.status_code == 422


def test_prediction_rejects_non_finite_numeric_input():
    client = TestClient(main.app)
    payload = {
        "warehouse_inventory_level": "NaN",
        "handling_equipment_availability": 0.5,
        "order_fulfillment_status": 0.5,
        "weather_condition_severity": 0.5,
        "shipping_costs": 100.0,
        "supplier_reliability_score": 0.5,
        "lead_time_days": 5.0,
        "historical_demand": 100.0,
        "cargo_condition_status": 0.5,
        "route_risk_level": 0.5,
        "customs_clearance_time": 2.0,
        "supplier_country": "Greece",
    }

    response = client.post("/predict/shipment-delay", json=payload)

    assert response.status_code == 422
