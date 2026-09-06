from pathlib import Path

from ml.evaluate import (
    EvaluationRecord,
    evaluate_decision,
    trigger_retraining_if_needed,
)
from ml.optimizer import OptimizationInput, optimize_alternatives


def make_scenario(**constraints):
    return OptimizationInput(
        predicted_delay=5.0,
        shipment_cost=100.0,
        shipment_time=8.0,
        shipment_capacity=50.0,
        **constraints,
    )


def test_optimizer_exposes_constraint_results_for_all_alternatives():
    result = optimize_alternatives(
        make_scenario(
            budget=200.0,
            allowed_time=10.0,
            available_capacity=100.0,
        )
    )

    assert len(result["alternatives"]) == 3
    for alternative in result["alternatives"]:
        assert alternative["budget_valid"] == (
            alternative["cost"] <= 200.0
        )
        assert alternative["time_valid"] == (
            alternative["time"] <= 10.0
        )
        assert alternative["capacity_valid"] == (
            alternative["capacity"] <= 100.0
        )
        assert alternative["all_constraints_satisfied"] == (
            alternative["feasibility"] == "feasible"
        )


def test_optimizer_marks_budget_time_and_capacity_failures():
    cases = [
        ("budget_valid", make_scenario(
            budget=5.0, allowed_time=10.0, available_capacity=100.0
        )),
        ("time_valid", make_scenario(
            budget=200.0, allowed_time=2.0, available_capacity=100.0
        )),
        ("capacity_valid", make_scenario(
            budget=200.0, allowed_time=10.0, available_capacity=10.0
        )),
    ]

    for failing_constraint, scenario in cases:
        result = optimize_alternatives(scenario)
        assert result["alternatives"]
        assert all(
            not alternative[failing_constraint]
            for alternative in result["alternatives"]
        )
        assert all(
            alternative["feasibility"] == "infeasible"
            for alternative in result["alternatives"]
        )


def test_evaluation_calculates_absolute_and_percentage_difference():
    result = evaluate_decision(
        EvaluationRecord(
            decision_id="decision-1",
            predicted_cost=120.0,
            actual_cost=100.0,
            record_id=11,
            recommendation_id=7,
        ),
        discrepancy_threshold_percent=10.0,
    )

    assert result["absolute_difference"] == 20.0
    assert result["percentage_difference"] == 20.0
    assert result["status"] == "discrepancy_detected"


def test_retraining_is_triggered_only_for_discrepancy(monkeypatch, tmp_path):
    calls = []

    def fake_retrain(model_path=None):
        calls.append(model_path)
        return {
            "model_path": str(tmp_path / "model.joblib"),
            "prediction_target": "delivery_time_deviation",
            "mae": 1.0,
            "rmse": 2.0,
            "r2": 0.5,
        }

    monkeypatch.setattr("ml.evaluate.retrain_model", fake_retrain)

    within_range = trigger_retraining_if_needed(
        {"status": "within_expected_range"}
    )
    discrepancy = trigger_retraining_if_needed(
        {"status": "discrepancy_detected"},
        Path(tmp_path / "model.joblib"),
    )

    assert within_range["triggered"] is False
    assert discrepancy["triggered"] is True
    assert discrepancy["training"]["prediction_target"] == (
        "delivery_time_deviation"
    )
    assert calls == [Path(tmp_path / "model.joblib")]