"""Decision evaluation and discrepancy-triggered model retraining."""

from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
from pathlib import Path
from typing import Optional

import joblib

from ml.train import load_dataset, prepare_data, train_model


@dataclass
class EvaluationRecord:
    """Input record for a decision evaluation."""

    decision_id: str
    predicted_cost: float
    actual_cost: Optional[float] = None
    record_id: Optional[int] = None
    recommendation_id: Optional[int] = None

    predicted_time: Optional[float] = None
    actual_time: Optional[float] = None

    predicted_outcome: Optional[str] = None
    actual_outcome: Optional[str] = None


def evaluate_decision(
    record: EvaluationRecord,
    discrepancy_threshold_percent: float = 10.0,
) -> dict:
    """
    Compare predicted cost with actual cost.

    `discrepancy_threshold_percent` is an implementation/configuration
    threshold. It is not presented as a company-provided business rule.

    Missing actual cost results in:
        status = "pending"

    No fabricated discrepancy is calculated.
    """

    if not record.decision_id:
        raise ValueError("decision_id is required")

    if record.predicted_cost < 0:
        raise ValueError("predicted_cost must be non-negative")

    if record.actual_cost is not None and record.actual_cost < 0:
        raise ValueError("actual_cost must be non-negative")

    if discrepancy_threshold_percent < 0:
        raise ValueError(
            "discrepancy_threshold_percent must be non-negative"
        )

    # Actual outcome is not available yet.
    if record.actual_cost is None:
        return {
            "decision_id": record.decision_id,
            "status": "pending",
            "predicted_cost": record.predicted_cost,
            "actual_cost": None,
            "absolute_difference": None,
            "percentage_difference": None,
            "roi_percent": None,
            "threshold_percent": discrepancy_threshold_percent,
        }

    absolute_difference = abs(
        record.actual_cost - record.predicted_cost
    )

    # Percentage difference is undefined when actual cost is zero.
    if record.actual_cost == 0:
        percentage_difference = None

        if record.predicted_cost == 0:
            status = "within_expected_range"
        else:
            status = "discrepancy_detected"

    else:
        percentage_difference = (
            absolute_difference / record.actual_cost
        ) * 100.0

        if percentage_difference <= discrepancy_threshold_percent:
            status = "within_expected_range"
        else:
            status = "discrepancy_detected"

    roi_percent = None
    if record.predicted_cost > 0:
        roi_percent = (
            (record.predicted_cost - record.actual_cost)
            / record.predicted_cost
        ) * 100.0

    return {
        "decision_id": record.decision_id,
        "status": status,
        "predicted_cost": record.predicted_cost,
        "actual_cost": record.actual_cost,
        "absolute_difference": absolute_difference,
        "percentage_difference": percentage_difference,
        "roi_percent": roi_percent,
        "threshold_percent": discrepancy_threshold_percent,
    }


def retrain_model(model_path: Optional[Path] = None) -> dict:
    """Train and persist a new XGBoost model using the project dataset."""

    data = load_dataset()
    features, target = prepare_data(data)
    previous_path = model_path or (
        Path(__file__).resolve().parents[2]
        / "models"
        / "shipment_delay_model.joblib"
    )
    previous_checksum = None
    if previous_path.exists():
        previous_checksum = hashlib.sha256(
            previous_path.read_bytes()
        ).hexdigest()

    pipeline, mae, rmse, r2 = train_model(features, target)

    output_path = previous_path
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, output_path)
    new_checksum = hashlib.sha256(
        output_path.read_bytes()
    ).hexdigest()
    training_rows = int(len(features) * 0.8)
    test_rows = len(features) - training_rows

    return {
        "model_path": str(output_path),
        "prediction_target": "delivery_time_deviation",
        "previous_checksum": previous_checksum,
        "new_checksum": new_checksum,
        "training_rows": training_rows,
        "test_rows": test_rows,
        "mae": float(mae),
        "rmse": float(rmse),
        "r2": float(r2),
        "training_timestamp": datetime.now(timezone.utc).isoformat(),
    }


def trigger_retraining_if_needed(
    evaluation: dict,
    model_path: Optional[Path] = None,
) -> dict:
    """Retrain automatically only when evaluation detects a discrepancy."""

    if evaluation.get("status") != "discrepancy_detected":
        return {
            "triggered": False,
            "evaluation_status": evaluation.get("status"),
            "training": None,
        }

    return {
        "triggered": True,
        "evaluation_status": evaluation["status"],
        "training": retrain_model(model_path),
    }