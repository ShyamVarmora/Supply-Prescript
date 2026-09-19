# Supply Prescript â€” Week 3 Evaluation Evidence

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

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
- Final model checksum and timestamp recorded in testing/final-qa-matrix.md.
- Browser closed-loop E2E completed successfully.

---

## Final integrated verification — 17/09/2026

Historical evidence above is retained for audit continuity. This section records the latest final-QA status.

- Direct POST /predict/shipment-delay: HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.
- Backend automated tests: 12 passed, 2 skipped, 1 warning in 12.37s.
- Current local PostgreSQL integration rerun: BLOCKED because localhost:5432 is unavailable on this PC; the latest run ended with KeyboardInterrupt after 34.96s and no PostgreSQL test passed.
- Frontend lint: PASS.
- Frontend build: PASS; 19 modules transformed.
- git diff --check: clean.
- Historical live-PostgreSQL evidence remains preserved in the document above.

### Exact current warning

`DeprecationWarning: The anyio.abc.BlockingPortal alias is deprecated, use anyio.from_thread.BlockingPortal instead.`

Source: `starlette/testclient.py:53`.
