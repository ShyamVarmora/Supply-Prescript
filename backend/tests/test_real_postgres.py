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
    record_id = 1
    prediction_ids = []
    recommendation_ids = []
    decision_ids = []

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT record_id FROM supply_chain_data "
                "WHERE record_id IN (1, 2) ORDER BY record_id"
            )
            assert [row["record_id"] for row in cursor.fetchall()] == [1, 2]

        client = TestClient(main.app)
        request_payload = {
            "record_id": record_id,
            "budget": 1234.5,
            "allowed_time": 21.5,
            "available_capacity": 101.0,
            "shipment_time": 8.5,
            "shipment_capacity": 49.5,
        }
        recommend_response = client.post(
            "/recommend",
            json=request_payload,
        )
        assert recommend_response.status_code == 200

        stored = recommend_response.json()["optimization"][
            "stored_recommendations"
        ]
        assert len(stored) == 3
        prediction_ids.append(
            recommend_response.json()["prediction"]["prediction_id"]
        )
        recommendation_ids.extend(
            item["recommendation_id"] for item in stored
        )
        assert all(
            recommendation["record_id"] == record_id
            and recommendation["recommendation_id"] > 0
            and recommendation["risk_reduction"] is None
            and recommendation["time_saved_days"] is None
            for recommendation in stored
        )

        duplicate_response = client.post(
            "/recommend",
            json=request_payload,
        )
        assert duplicate_response.status_code == 200
        prediction_ids.append(
            duplicate_response.json()["prediction"]["prediction_id"]
        )
        assert [
            item["recommendation_id"]
            for item in duplicate_response.json()["optimization"][
                "stored_recommendations"
            ]
        ] == [item["recommendation_id"] for item in stored]

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
        decision_ids.append(decision["decision_id"])

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

        pending_response = client.get(
            f"/decisions/{decision['decision_id']}/evaluation"
        )
        assert pending_response.status_code == 200
        assert pending_response.json()["evaluation"]["status"] == "pending"

        outcome_response = client.post(
            f"/decisions/{decision['decision_id']}/outcome",
            json={
                "actual_cost": selected["cost"] * 1.2,
                "actual_delay_days": 11.0,
                "outcome_status": "COMPLETED",
            },
        )
        assert outcome_response.status_code == 200

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
        assert evaluation_result["retraining"]["training"]["r2"] >= -1
        assert evaluation_result["retraining"]["training"]["previous_checksum"]
        assert evaluation_result["retraining"]["training"]["new_checksum"]
        assert evaluation_result["retraining"]["training"]["training_rows"] > 0
        assert evaluation_result["retraining"]["training"]["test_rows"] > 0
        assert evaluation_result["retraining"]["training"]["training_timestamp"]

        repeat_evaluation = client.get(
            f"/decisions/{decision['decision_id']}/evaluation"
        )
        assert repeat_evaluation.json()["retraining"]["triggered"] is False

        exact_decision_response = client.post(
            "/decisions",
            json={
                "record_id": record_id,
                "recommendation_id": selected["recommendation_id"],
                "selected_action": selected["action"],
                "decision_status": "SELECTED",
            },
        )
        assert exact_decision_response.status_code == 200
        exact_decision = exact_decision_response.json()
        decision_ids.append(exact_decision["decision_id"])
        exact_outcome = client.post(
            f"/decisions/{exact_decision['decision_id']}/outcome",
            json={"actual_cost": selected["cost"]},
        )
        assert exact_outcome.status_code == 200
        exact_evaluation = client.get(
            f"/decisions/{exact_decision['decision_id']}/evaluation"
        )
        assert exact_evaluation.json()["evaluation"]["status"] == (
            "within_expected_range"
        )

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

        invalid_recommendation_response = client.post(
            "/decisions",
            json={
                "record_id": record_id,
                "recommendation_id": 999999999,
                "selected_action": selected["action"],
                "decision_status": "SELECTED",
            },
        )
        assert invalid_recommendation_response.status_code == 404

        cross_record_response = client.post(
            "/decisions",
            json={
                "record_id": 2,
                "recommendation_id": selected["recommendation_id"],
                "selected_action": selected["action"],
                "decision_status": "SELECTED",
            },
        )
        assert cross_record_response.status_code == 404

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
        recommendation_ids.extend(
            item["recommendation_id"]
            for item in infeasible_recommendation_response.json()[
                "optimization"
            ]["stored_recommendations"]
        )
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
        with connection.cursor() as cursor:
            if decision_ids:
                cursor.execute(
                    "DELETE FROM actual_outcomes WHERE decision_id = ANY(%s)",
                    (decision_ids,),
                )
                cursor.execute(
                    "DELETE FROM decision_log WHERE decision_id = ANY(%s)",
                    (decision_ids,),
                )
            if recommendation_ids:
                cursor.execute(
                    "DELETE FROM prescriptive_recommendations "
                    "WHERE recommendation_id = ANY(%s)",
                    (recommendation_ids,),
                )
            if prediction_ids:
                cursor.execute(
                    "DELETE FROM predictions WHERE prediction_id = ANY(%s)",
                    (prediction_ids,),
                )
        connection.commit()
        connection.close()


def test_real_recommendation_is_idempotent_and_evaluates_pending():
    connection = db_connection()
    record_id = None

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT record_id
                FROM supply_chain_data
                ORDER BY record_id
                OFFSET 1
                LIMIT 1
                """
            )
            record_id = cursor.fetchone()["record_id"]

        client = TestClient(main.app)
        request = {
            "record_id": record_id,
            "budget": 1000,
            "allowed_time": 20,
            "available_capacity": 100,
            "shipment_time": 8,
            "shipment_capacity": 50,
        }
        first = client.post("/recommend", json=request)
        second = client.post("/recommend", json=request)
        assert first.status_code == second.status_code == 200
        first_rows = first.json()["optimization"]["stored_recommendations"]
        second_rows = second.json()["optimization"]["stored_recommendations"]
        assert len(first_rows) == len(second_rows) == 3
        assert [row["recommendation_id"] for row in first_rows] == [
            row["recommendation_id"] for row in second_rows
        ]

        feasible = next(
            row for row in first_rows if row["feasibility"] == "feasible"
        )
        decision = client.post(
            "/decisions",
            json={
                "record_id": record_id,
                "recommendation_id": feasible["recommendation_id"],
                "selected_action": feasible["action"],
            },
        )
        assert decision.status_code == 200
        decision_id = decision.json()["decision_id"]
        pending = client.get(f"/decisions/{decision_id}/evaluation")
        assert pending.status_code == 200
        assert pending.json()["evaluation"]["status"] == "pending"

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) AS count FROM prescriptive_recommendations "
                "WHERE record_id = %s",
                (record_id,),
            )
            assert cursor.fetchone()["count"] == 3
    finally:
        if connection is not None:
            if record_id is not None:
                with connection.cursor() as cursor:
                    cursor.execute(
                        "DELETE FROM actual_outcomes WHERE decision_id IN "
                        "(SELECT decision_id FROM decision_log WHERE record_id = %s)",
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
                        "DELETE FROM predictions WHERE record_id = %s",
                        (record_id,),
                    )
                connection.commit()
            connection.close()