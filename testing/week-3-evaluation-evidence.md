# Supply Prescript â€” Week 3 Evaluation Evidence

## Purpose

This document records the actual execution evidence for the Week 3
predicted-versus-actual evaluation module.

The evaluation module compares a predicted cost with a known actual cost
and calculates the discrepancy.

The module is independent of the database, frontend, Decision ROI UI,
and automatic retraining workflow.

Only tests that were actually executed are marked PASS.

---

## Evaluation Module

Implementation:

`backend/ml/evaluate.py`

The module accepts an evaluation record containing:

- `decision_id`
- `predicted_cost`
- `actual_cost`

It can also accept:

- `predicted_time`
- `actual_time`
- `predicted_outcome`
- `actual_outcome`

The discrepancy threshold is configurable through:

`discrepancy_threshold_percent`

The default implementation threshold is 10%.

This is an implementation/testing threshold and is not presented as a
company-provided business rule.

---

## Test 1 â€” Exact Match

**Status: PASS**

### Input

```text
decision_id = test-1
predicted_cost = 500
actual_cost = 500

## Final Verification Update - 2026-09-14

Final integrated verification was performed against the current devops implementation.

- PostgreSQL verified with 5 required tables and live row counts.
- Prediction persisted in predictions for record 1.
- Three recommendations verified.
- Budget, time and capacity constraints verified.
- Decision 50 executed and persisted.
- Actual outcome 44 persisted for Decision 50.
- Evaluation returned discrepancy_detected and ROI 12.377519407267744%.
- ROI analytics returned 8 evaluated decisions, 5 positive outcomes, 3 negative outcomes, 62.5% positive rate, average ROI -0.30889857936569803%.
- Retraining timestamp persisted for Decision 50.
- Final model checksum and timestamp recorded in 	esting/final-qa-matrix.md.
- Browser closed-loop E2E completed successfully.
