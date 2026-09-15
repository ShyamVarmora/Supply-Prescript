# Final E2E Evidence - Supply Prescript Project 3

## Scope

Target branch: final integrated `devops` branch.

Environment:
- React frontend
- FastAPI backend
- PostgreSQL operational test database
- XGBoost prediction
- SciPy optimization

## 20-Point Evidence Matrix

| # | E2E Requirement | Actual Result | Evidence | Status |
|---|---|---|---|---|
| 1 | Database connected | PostgreSQL connection succeeded against `supply_prescript_db` | Real PostgreSQL QA run | PASS |
| 2 | Historical dataset loaded | CSV historical dataset contains 113097 rows | `data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` | PASS |
| 3 | Real record selected | Record ID 1 used for final E2E workflow | Live `/recommend` request | PASS |
| 4 | Prediction generated | `delivery_time_deviation` prediction returned for record 1 | Live `/recommend` response | PASS |
| 5 | Prediction persisted | Prediction row persisted for record 1 | SQL verification of `predictions` | PASS |
| 6 | 3 recommendations generated | Air Freight, Secondary Supplier, Delay Launch returned | Live optimization response | PASS |
| 7 | Budget constraint verified | Feasibility enforced by optimizer; hard-budget test also executed | Optimizer tests / live feasibility flags | PASS |
| 8 | Time constraint verified | Feasibility enforced by optimizer | Optimizer time-constraint test | PASS |
| 9 | Capacity constraint verified | Feasibility enforced by optimizer | Optimizer capacity-constraint test | PASS |
| 10 | Feasible recommendation selected | Air Freight selected | Browser E2E execution | PASS |
| 11 | Execute Decision | Decision ID 50 returned | Browser/API execution | PASS |
| 12 | decision_log INSERT verified | Decision 50 stored with recommendation 109 and expected cost 684.7557795 | SQL verification below | PASS |
| 13 | Actual Outcome submitted | Outcome 44 stored: actual cost 600, delay 6, completed | SQL verification below | PASS |
| 14 | actual_outcomes INSERT verified | Outcome 44 linked to Decision 50 | SQL verification below | PASS |
| 15 | Evaluation generated | Predicted 684.7557795 vs actual 600; difference 84.75577950000002 | Decision 50 evaluation data | PASS |
| 16 | Discrepancy detected | 14.125963250000003% difference against 10% threshold; status `discrepancy_detected` | Decision 50 evaluation data | PASS |
| 17 | Decision ROI generated | ROI = 12.377519407267744% | Decision 50 evaluation data | PASS |
| 18 | Decision history verified | Decision 50 appears with stored outcome/evaluation data | `GET /decisions/history` | PASS |
| 19 | ROI analytics verified | 8 total/evaluated; 5 positive; 3 negative; 62.5% positive rate; average ROI -0.30889857936569803 | `GET /decisions/analytics/roi` | PASS |
| 20 | Discrepancy/retraining evidence verified | Decision 50 has `retraining_triggered_at`; updated model artifact was captured with SHA-256 and timestamp in final QA matrix | SQL + model artifact evidence | PASS |

## Browser Workflow

`Record -> Generate -> Prediction -> 3 Alternatives -> Select Feasible Alternative -> Execute -> Decision ID -> Actual Outcome -> Evaluation -> ROI -> History -> ROI Analytics`

## Automated Evidence

- `pytest backend/tests -v` -> **14 passed**
- `RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v` -> **2 passed, 1 warning**
- `npm.cmd --prefix frontend run lint` -> **PASS**
- `npm.cmd --prefix frontend run build` -> **PASS; Vite 8.2.1; 19 modules transformed**
- `git diff --check` -> **PASS; no actual whitespace errors; only Windows LF/CRLF warning was observed**

## Decision 50 - API and SQL Evidence

### Decision API result

The verified browser/API execution returned:

- `decision_id`: 50
- `record_id`: 1
- `recommendation_id`: 109
- `selected_action`: `Air Freight`
- `expected_cost`: `684.7557795`
- `decision_status`: `SELECTED`

### Decision SQL verification

Verified stored `decision_log` row:

```text
decision_id = 50
record_id = 1
recommendation_id = 109
selected_action = Air Freight
expected_cost = 684.7557795
decision_status = SELECTED
retraining_triggered_at = 2026-09-14 23:30:59.769236+05:30
selected_at = 2026-09-14 23:30:08.782491+05:30
```

### Outcome API result

Decision 50 was followed by an actual outcome submission:

- `outcome_id`: 44
- `decision_id`: 50
- `actual_cost`: 600
- `actual_delay_days`: 6
- `outcome_status`: `completed`

### Outcome SQL verification

Verified stored `actual_outcomes` row:

```text
outcome_id = 44
decision_id = 50
actual_cost = 600
actual_delay_days = 6
outcome_status = completed
evaluated_at = 2026-09-14 23:30:59.702662+05:30
```

### Evaluation / history verification

Stored/history evaluation for Decision 50:

```text
status = discrepancy_detected
predicted_cost = 684.7557795
actual_cost = 600
absolute_difference = 84.75577950000002
percentage_difference = 14.125963250000003
roi_percent = 12.377519407267744
threshold = 10
```

## Operational Database Scope

The historical CSV dataset contains 113097 rows. This must not be interpreted as 113097 operational PostgreSQL rows.

The PostgreSQL QA database was verified with the required tables:

1. `supply_chain_data`
2. `predictions`
3. `prescriptive_recommendations`
4. `decision_log`
5. `actual_outcomes`

Final E2E evidence uses real PostgreSQL test records and persisted decision/outcome rows rather than claiming the CSV row count as the operational database row count.

## Evidence Integrity

This document distinguishes historical dataset size from operational PostgreSQL test data. Automated-test counts and Decision 50 values are taken from the latest verified evidence available for the final QA package. No fabricated screenshots, database rows, test results, performance values, or ROI values are asserted.
