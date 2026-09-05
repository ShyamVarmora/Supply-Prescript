"""
Week 3 decision evaluation logic.

This module compares a recorded prediction with an actual outcome.
It does not connect to the database, frontend, ROI UI, or retraining workflow.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class EvaluationRecord:
    """Input record for a decision evaluation."""

    decision_id: str
    predicted_cost: float
    actual_cost: Optional[float] = None

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

    return {
        "decision_id": record.decision_id,
        "status": status,
        "predicted_cost": record.predicted_cost,
        "actual_cost": record.actual_cost,
        "absolute_difference": absolute_difference,
        "percentage_difference": percentage_difference,
        "threshold_percent": discrepancy_threshold_percent,
    }