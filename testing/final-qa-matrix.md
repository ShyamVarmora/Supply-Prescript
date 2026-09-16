# Supply Prescript - Final QA Matrix

## Scope

Final QA target: integrated `devops` implementation with documentation synchronized from the latest verified evidence.

PASS is used only where actual implementation and execution evidence support the specific requirement.

| Requirement | Test | Expected | Actual | Evidence | Status |
|---|---|---|---|---|---|
| XGBoost predictive baseline | Model/training and runtime prediction verification | Trained model available and used | XGBoost model artifact available; runtime prediction verified | Training/evaluation evidence + model artifact | PASS |
| Historical dataset | Inspect historical CSV | Historical supply-chain dataset available | 113097 rows, 18 columns in CSV | `data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` | PASS |
| PostgreSQL operational test database | Connect and verify schema | PostgreSQL connection and required tables | `supply_prescript_db` connected; 5 required tables verified; real test records used | SQL verification below | PASS |
| Prediction persistence | `/recommend` + SQL | Prediction generated and stored | Record 1 prediction persisted in `predictions`; target `delivery_time_deviation`, value `6.1492509841918945` | API + SQL verification | PASS |
| Three recommendations | `/recommend` | Exactly 3 alternatives | Air Freight, Secondary Supplier, Delay Launch | Live optimization response | PASS |
| Budget constraint | Normal + hard-budget scenario | Budget feasibility enforced | Normal case feasible; budget 40 failure case tested | Optimizer evidence | PASS |
| Time constraint | Restrictive time scenario | Time feasibility enforced | Restrictive time handling covered by optimizer tests | Optimizer evidence | PASS |
| Capacity constraint | Restrictive capacity scenario | Capacity feasibility enforced | Restrictive capacity handling covered by optimizer tests | Optimizer evidence | PASS |
| Execute Decision | Browser/API + SQL | Feasible recommendation can be executed and stored | Decision 50 created for recommendation 109 / Air Freight | API result + `decision_log` SQL | PASS |
| Decision DB write-back | SQL verification | Decision row persisted | Decision 50 stored with expected cost 684.7557795 | `decision_log` SQL evidence | PASS |
| Actual outcome DB write-back | Outcome API + SQL | Actual result persisted | Outcome 44 linked to Decision 50: actual cost 600, delay 6, completed | Outcome API + `actual_outcomes` SQL | PASS |
| Evaluation | Evaluation/history | Predicted vs actual comparison generated | Decision 50: predicted 684.7557795 vs actual 600 | Evaluation/history evidence | PASS |
| Discrepancy | Evaluation threshold | Discrepancy detected above threshold | 14.125963250000003% difference vs 10% threshold; `discrepancy_detected` | Decision 50 evaluation | PASS |
| Decision ROI | Evaluation/ROI | ROI computed from stored outcome | Decision 50 ROI = 12.377519407267744% | Evaluation/history evidence | PASS |
| Decision history | `GET /decisions/history` | Stored decisions returned | Decision 50 and evaluation/outcome data returned | Live API history response | PASS |
| ROI analytics | `GET /decisions/analytics/roi` | Aggregated metrics returned | 8 total/evaluated; 5 positive; 3 negative; 62.5% positive rate; average ROI -0.30889857936569803% | Live backend analytics | PASS |
| Closed-loop discrepancy-triggered retraining | Discrepancy case + SQL + model artifact | Trigger recorded and updated artifact available | Decision 50 has populated `retraining_triggered_at`; updated model artifact metadata recorded | `decision_log` SQL + model artifact metadata | PASS |
| Browser E2E | Full UI workflow | Closed-loop workflow completes without blocking error | Record -> Generate -> Prediction -> 3 alternatives -> Select -> Execute -> Outcome -> Evaluation -> ROI -> History -> ROI Analytics completed | Browser E2E evidence | PASS |
| Frontend lint | `npm.cmd --prefix frontend run lint` | No lint errors | PASS | Latest frontend lint run | PASS |
| Frontend build | `npm.cmd --prefix frontend run build` | Production bundle succeeds | PASS; Vite 8.2.1; 19 modules transformed | Latest frontend build output | PASS |
| Backend automated tests | `pytest backend/tests -v` | All current backend tests pass | **14 passed** | Latest local test run | PASS |
| Real PostgreSQL tests | `RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v` | Real DB integration tests pass | **2 passed, 1 warning** | Latest local real-DB test run | PASS |
| Git whitespace | `git diff --check` | No actual diff-check errors | No actual whitespace errors; only Windows LF/CRLF conversion warning was observed | Latest diff check | PASS |

## Historical Dataset vs Operational Database

The **historical dataset** is the CSV file:

`data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv`

Verified historical volume:

- 113097 rows
- 18 columns

The **PostgreSQL operational test database** is `supply_prescript_db`. Final QA does **not** equate the CSV row count with the number of operational PostgreSQL rows.

Real PostgreSQL test records were used for final E2E verification.

## PostgreSQL SQL Verification Evidence

### Required table verification

Query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('supply_chain_data','predictions','prescriptive_recommendations','decision_log','actual_outcomes')
ORDER BY table_name;
```

Actual output:

```text
actual_outcomes
decision_log
predictions
prescriptive_recommendations
supply_chain_data
```

### Real supply-chain records

Query:

```sql
SELECT record_id FROM supply_chain_data
WHERE record_id IN (1,2,3)
ORDER BY record_id;
```

Actual output:

```text
1
2
3
```

### Prediction persistence

Query:

```sql
SELECT prediction_id, record_id, target, predicted_value
FROM predictions
WHERE record_id = 1
ORDER BY prediction_id DESC
LIMIT 1;
```

Actual verified row used in final QA:

```text
prediction_id=11 | record_id=1 | target=delivery_time_deviation | predicted_value=6.1492509841918945
```

## Decision 50 / API + SQL Evidence

### Decision result

```text
decision_id = 50
record_id = 1
recommendation_id = 109
selected_action = Air Freight
expected_cost = 684.7557795
decision_status = SELECTED
selected_at = 2026-09-14 23:30:08.782491+05:30
retraining_triggered_at = 2026-09-14 23:30:59.769236+05:30
```

Decision SQL query:

```sql
SELECT decision_id, record_id, recommendation_id, selected_action,
       expected_cost, decision_status, retraining_triggered_at, selected_at
FROM decision_log
WHERE decision_id = 50;
```

### Outcome result

```text
outcome_id = 44
decision_id = 50
actual_cost = 600
actual_delay_days = 6
outcome_status = completed
evaluated_at = 2026-09-14 23:30:59.702662+05:30
```

Outcome SQL query:

```sql
SELECT outcome_id, decision_id, actual_cost, actual_delay_days,
       outcome_status, evaluated_at
FROM actual_outcomes
WHERE decision_id = 50;
```

## Evaluation

```text
status = discrepancy_detected
predicted_cost = 684.7557795
actual_cost = 600
absolute_difference = 84.75577950000002
percentage_difference = 14.125963250000003
roi_percent = 12.377519407267744
threshold = 10
```

These values use the same Decision 50 / Outcome 44 dataset as `testing/final-e2e-evidence.md`.

## ROI Analytics

Positive outcome definition:

`actual_cost <= expected_cost`

Latest verified backend analytics:

- total decisions: 8
- evaluated decisions: 8
- positive outcomes: 5
- negative outcomes: 3
- positive outcome rate: 62.5%
- average ROI: -0.30889857936569803%

## Automated Test Snapshot

```text
pytest backend/tests -v
14 passed

RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v
2 passed, 1 warning

npm.cmd --prefix frontend run lint
PASS

npm.cmd --prefix frontend run build
PASS; Vite 8.2.1; 19 modules transformed

git diff --check
PASS; no actual whitespace errors; Windows CRLF conversion warning observed
```

## Model Artifact Evidence

```text
SHA-256: DBF30350C08ABA3958219B76C552C8BA847FC7B5534E5E75B4AD468A11BB2F2B
Size: 1372358 bytes
LastWriteTime: 2026-09-14 23:33:28
```

## README Verification

The current `devops` README is retained as the source for README content. It states React, FastAPI/Python, PostgreSQL, XGBoost, SciPy, REST APIs, the closed-loop workflow, and documents `GET /decisions/analytics/roi`.

No garbled README replacement is included in this final docs correction.

## Evidence Integrity

No fabricated screenshots, database rows, test results, or ROI values are asserted. Historical CSV volume is explicitly distinguished from operational PostgreSQL test data, and the latest backend test result is recorded as 14 passed rather than the earlier stale snapshot.
