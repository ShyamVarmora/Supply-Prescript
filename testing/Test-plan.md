# Project 3 — QA Test Plan

## Purpose

This document defines the QA testing scope for the Supply Prescript Project 3 implementation.

No test cases are marked as passed at this stage.

## Predictive Model

Testing will verify:

- Disruption probability prediction.
- Disruption duration prediction.
- Historical supply-chain data usage.
- XGBoost / LightGBM model behavior.

## Optimization

Testing will verify:

- SciPy / PuLP optimization.
- Budget constraint.
- Time constraint.
- Capacity constraint.
- Generation of three best alternative actions.

## Write-Back

Testing will verify:

- Decision insertion into the operational database.
- Correct decision data persistence.
- Successful write-back behavior.

## Closed Loop

Testing will verify:

- Predicted cost versus actual outcome.
- Actual outcome capture.
- Decision ROI calculation.

## Decision ROI

Testing will verify:

- ROI calculation.
- ROI display.
- Consistency between predicted and actual outcomes.

## Retraining

Testing will verify:

- Detection of discrepancies between predictions and actual outcomes.
- Retraining trigger behavior.
- XGBoost retraining workflow.

## UI

Testing will verify:

- Recommendations are displayed.
- Cost versus Speed trade-offs are visible.
- User can execute a decision.
- Analyst can participate in the decision workflow.

## Test Status

No Project 3 functionality has been marked as PASS at this stage.

Testing status will be updated after the corresponding implementation and verification are completed.
