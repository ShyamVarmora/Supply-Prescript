import os

import psycopg
import pytest
from fastapi.testclient import TestClient

from app import main


pytestmark = pytest.mark.skipif(
    os.getenv("RUN_REAL_DB") != "1",
    reason="Set RUN_REAL_DB=1 to run against PostgreSQL.",
)


def db_connection():
    return psycopg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        dbname=os.getenv("DB_NAME", "supply_prescript_db"),
        row_factory=psycopg.rows.dict_row,
    )


def test_real_recommendation_and_decision_write_back():
    connection = db_connection()
    record_id = None

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO supply_chain_data (
                    warehouse_inventory_level,
                    handling_equipment_availability,
                    order_fulfillment_status,
                    weather_condition_severity,
                    shipping_costs,
                    supplier_reliability_score,
                    lead_time_days,
                    historical_demand,
                    cargo_condition_status,
                    route_risk_level,
                    customs_clearance_time,
                    supplier_country
                )
                VALUES (
                    985.7168615, 0.481293674, 0.761166168,
                    0.35906606, 456.503853, 0.986064284,
                    2.128008822, 100.7728538, 0.777263471,
                    1.182115989, 0.502006422, 'Greece'
                )
                RETURNING record_id
                """
            )
            record_id = cursor.fetchone()["record_id"]
        connection.commit()

        client = TestClient(main.app)
        recommend_response = client.post(
            "/recommend",
            json={
                "record_id": record_id,
                "warehouse_inventory_level": 0,
                "handling_equipment_availability": 0,
                "order_fulfillment_status": 0,
                "weather_condition_severity": 0,
                "shipping_costs": 456.503853,
                "supplier_reliability_score": 0,
                "lead_time_days": 0,
                "historical_demand": 0,
                "cargo_condition_status": 0,
                "route_risk_level": 0,
                "customs_clearance_time": 0,
                "supplier_country": "Greece",
                "budget": 1000,
                "allowed_time": 20,
                "available_capacity": 100,
                "shipment_time": 8,
                "shipment_capacity": 50,
            },
        )
        assert recommend_response.status_code == 200

        stored = recommend_response.json()["optimization"][
            "stored_recommendations"
        ]
        assert len(stored) == 3
        assert all(
            recommendation["record_id"] == record_id
            and recommendation["recommendation_id"] > 0
            and recommendation["risk_reduction"] is None
            and recommendation["time_saved_days"] is None
            for recommendation in stored
        )

        selected = next(
            recommendation
            for recommendation in stored
            if recommendation["feasibility"] == "feasible"
        )
        decision_response = client.post(
            "/decisions",
            json={
                "record_id": record_id,
                "recommendation_id": selected["recommendation_id"],
                "selected_action": selected["action"],
                "decision_status": "SELECTED",
            },
        )
        assert decision_response.status_code == 200
        decision = decision_response.json()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    d.record_id,
                    d.recommendation_id,
                    d.selected_action,
                    d.decision_id,
                    d.decision_status
                FROM decision_log d
                WHERE d.decision_id = %s
                """,
                (decision["decision_id"],),
            )
            row = cursor.fetchone()

        assert row == {
            "record_id": record_id,
            "recommendation_id": selected["recommendation_id"],
            "selected_action": selected["action"],
            "decision_id": decision["decision_id"],
            "decision_status": "SELECTED",
        }
        print(f"REAL_DB_SELECT {dict(row)}")

        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO actual_outcomes (
                    decision_id,
                    actual_cost,
                    actual_delay_days,
                    outcome_status
                )
                VALUES (%s, %s, %s, %s)
                """,
                (
                    decision["decision_id"],
                    selected["cost"] * 1.2,
                    11.0,
                    "COMPLETED",
                ),
            )
        connection.commit()

        evaluation_response = client.get(
            f"/decisions/{decision['decision_id']}/evaluation"
        )
        assert evaluation_response.status_code == 200
        evaluation_result = evaluation_response.json()
        assert evaluation_result["evaluation"]["status"] == (
            "discrepancy_detected"
        )
        assert evaluation_result["evaluation"]["actual_cost"] == (
            selected["cost"] * 1.2
        )
        assert evaluation_result["retraining"]["triggered"] is True
        assert evaluation_result["retraining"]["training"]["mae"] >= 0
        assert evaluation_result["retraining"]["training"]["rmse"] >= 0

        invalid_record_response = client.post(
            "/decisions",
            json={
                "record_id": record_id + 1000000,
                "recommendation_id": selected["recommendation_id"],
                "selected_action": selected["action"],
                "decision_status": "SELECTED",
            },
        )
        assert invalid_record_response.status_code == 404

        wrong_action_response = client.post(
            "/decisions",
            json={
                "record_id": record_id,
                "recommendation_id": selected["recommendation_id"],
                "selected_action": "Unapproved Action",
                "decision_status": "SELECTED",
            },
        )
        assert wrong_action_response.status_code == 422

        infeasible_recommendation_response = client.post(
            "/recommend",
            json={
                "record_id": record_id,
                "warehouse_inventory_level": 0,
                "handling_equipment_availability": 0,
                "order_fulfillment_status": 0,
                "weather_condition_severity": 0,
                "shipping_costs": 456.503853,
                "supplier_reliability_score": 0,
                "lead_time_days": 0,
                "historical_demand": 0,
                "cargo_condition_status": 0,
                "route_risk_level": 0,
                "customs_clearance_time": 0,
                "supplier_country": "Greece",
                "budget": 5,
                "allowed_time": 2,
                "available_capacity": 10,
                "shipment_time": 8,
                "shipment_capacity": 50,
            },
        )
        assert infeasible_recommendation_response.status_code == 200
        infeasible = infeasible_recommendation_response.json()[
            "optimization"
        ]["stored_recommendations"][0]
        assert infeasible["feasibility"] == "infeasible"

        infeasible_decision_response = client.post(
            "/decisions",
            json={
                "record_id": record_id,
                "recommendation_id": infeasible["recommendation_id"],
                "selected_action": infeasible["action"],
                "decision_status": "SELECTED",
            },
        )
        assert infeasible_decision_response.status_code == 422
    finally:
        if record_id is not None:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    DELETE FROM actual_outcomes
                    WHERE decision_id IN (
                        SELECT decision_id
                        FROM decision_log
                        WHERE record_id = %s
                    )
                    """,
                    (record_id,),
                )
                cursor.execute(
                    "DELETE FROM decision_log WHERE record_id = %s",
                    (record_id,),
                )
                cursor.execute(
                    "DELETE FROM prescriptive_recommendations "
                    "WHERE record_id = %s",
                    (record_id,),
                )
                cursor.execute(
                    "DELETE FROM supply_chain_data WHERE record_id = %s",
                    (record_id,),
                )
            connection.commit()
        connection.close()