# Supply Prescript - Week 3 Evaluation Evidence

## Purpose

This document records the verified Week 3 predicted-versus-actual evaluation state for the integrated `devops` implementation.

## Evaluation Module

Implementation: `backend/ml/evaluate.py`

Decision 50 was evaluated using stored decision/outcome data.

| Field | Actual Result |
|---|---:|
| Decision ID | 50 |
| Predicted/expected cost | 684.7557795 |
| Actual cost | 600 |
| Absolute difference | 84.75577950000002 |
| Percentage difference | 14.125963250000003% |
| Threshold | 10% |
| Evaluation status | `discrepancy_detected` |
| ROI | 12.377519407267744% |

## Outcome

Outcome 44 is linked to Decision 50:

- actual cost: 600
- actual delay days: 6
- outcome status: `completed`

## ROI Analytics

Latest verified backend analytics:

- total decisions: 8
- evaluated decisions: 8
- positive outcomes: 5
- negative outcomes: 3
- positive outcome rate: 62.5%
- average ROI: -0.30889857936569803%
- positive outcome definition: `actual_cost <= expected_cost`

## Evidence

- Decision 50 / Outcome 44 API and SQL evidence is recorded in `testing/final-e2e-evidence.md` and `testing/final-qa-matrix.md`.
- PostgreSQL operational test database is `supply_prescript_db`.
- Historical CSV volume is 113097 rows and is not treated as the PostgreSQL operational row count.

## Status

**PASS - Week 3 evaluation and Decision ROI are synchronized with the final verified Project 3 state.**
