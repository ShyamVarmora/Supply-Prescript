# Supply Prescript — Week 3 Evaluation Evidence

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

## Test 1 — Exact Match

**Status: PASS**

### Input

```text
decision_id = test-1
predicted_cost = 500
actual_cost = 500