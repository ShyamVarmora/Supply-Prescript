# Supply Prescript - Project 3 Requirement Traceability Matrix

## Purpose

This matrix maps Project 3 requirements to implementation, actual verification evidence, demo evidence, owner, and status.

PASS is used only where implementation and actual execution evidence support the specific requirement.

## Status Definitions

- PASS - implemented and verified with actual evidence
- IN PROGRESS - partial implementation exists but the complete requirement is not verified
- BLOCKED - required dependency or infrastructure is unavailable
- NOT STARTED - work has not started
- FAIL - implementation exists but does not satisfy the requirement

---

# Week 1 - Predictive Baseline

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| XGBoost predictive baseline | `backend/ml/train.py`; `models/shipment_delay_model.joblib` | Actual dataset/training evidence: 113097 historical CSV rows, 90477 training samples, 22620 testing samples; MAE/RMSE/R2 recorded | Model loaded and backend prediction verified | Chetan | PASS |
| Historical supply-chain data | `data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` | Historical CSV verified with 113097 rows and 18 columns | Real dataset record used by workflow | Mansi | PASS |
| Shipment-delay prediction | `backend/ml/predict.py`; `POST /predict/shipment-delay`; `POST /recommend` | Final live `/recommend` returned prediction target `delivery_time_deviation` and predicted delay 5.67630672454834 | Browser displayed prediction | Chetan | PASS |
| React application | `frontend/` React/Vite application | `npm.cmd --prefix frontend run lint` PASS; production build PASS, 19 modules transformed | Browser UI loaded and completed closed-loop workflow | Yoshita | PASS |
| PostgreSQL operational test database | FastAPI + psycopg + PostgreSQL schema | Real PostgreSQL integration tests: 2/2 passed; 5 required tables verified; real test records used for E2E verification | Browser write-back/evaluation used live PostgreSQL test data | Mansi/Chetan | PASS |

---

# Week 2 - Optimization and Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Budget constraint | `backend/ml/optimizer.py` | Automated optimizer tests passed; hard-budget failure case with budget 40 was tested | Final live recommendation scenario used budget 700 | Chetan | PASS |
| Time constraint | `backend/ml/optimizer.py` | Automated optimizer tests covered time constraint handling and a restrictive time-failure scenario | Alternatives expose time values and feasibility | Chetan | PASS |
| Capacity constraint | `backend/ml/optimizer.py` | Automated optimizer tests covered capacity constraint handling and a restrictive capacity-failure scenario | Alternatives expose capacity validity | Chetan | PASS |
| SciPy optimization | `scipy.optimize.linprog` | Optimizer workflow tests passed | Live `/recommend` returned optimization status `optimal` | Chetan | PASS |
| Three solver-generated alternatives | `backend/ml/optimizer.py` | Optimizer test confirms three alternatives | Browser displayed Air Freight, Secondary Supplier, Delay Launch | Chetan | PASS |
| Three feasible alternatives | `/recommend` | Final verified scenario: budget 700, time 20, capacity 100; returned alternatives were feasible | Browser displayed all three as feasible | Chetan | PASS |
| Three prescription cards | `frontend/src/App.jsx` | Frontend lint/build PASS | Browser displayed three live backend-backed cards | Yoshita | PASS |
| Cost display | `frontend/src/App.jsx` | Live backend values persisted in recommendations | Browser displayed recommendation costs | Yoshita | PASS |
| Speed/time display | `frontend/src/App.jsx` | Live backend recommendation time values returned | Browser displayed time values | Yoshita | PASS |
| Cost vs speed trade-off | Frontend recommendation cards | Automated/frontend verification and live backend response | Browser showed cost/time trade-offs for all alternatives | Chetan/Yoshita | PASS |

---

# Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint | Optimizer feasibility validation | Optimizer tests passed for normal and budget-failure scenarios; budget 40 hard-failure case recorded | Live recommendation cards showed feasibility | Chetan/Prashant | PASS |
| Execute Decision | `frontend/src/App.jsx`; `POST /decisions` | Real PostgreSQL integration tests passed | Browser executed selected recommendation and returned Decision ID 50 | Yoshita/Chetan | PASS |
| Real database INSERT | `decision_log`, `prescriptive_recommendations`, `actual_outcomes` | Real PostgreSQL write-back tests passed | Browser decision/outcome flow completed against live DB | Chetan/Mansi | PASS |
| Negative write-back validation | Decision validation in `backend/app/main.py` | Invalid IDs, wrong record/recommendation, wrong action and infeasible action rejection covered by automated validation/tests and live verification evidence | Invalid actions are rejected; infeasible recommendation cannot be selected | Chetan/Mansi | PASS |

---

# Week 3 - Evaluation and Closed Loop

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Standalone evaluation | `backend/ml/evaluate.py` | Evaluation workflow tests passed | Evaluation result displayed in browser | Chetan/Prashant | PASS |
| Predicted vs actual comparison | `evaluate_decision()` | Difference and percentage calculations passed automated tests | Browser showed predicted cost, actual cost, difference and percentage | Chetan/Prashant | PASS |
| Missing actual outcome handling | Evaluation workflow | Pending evaluation test passed | Pending state is shown when outcome is absent | Chetan | PASS |
| Actual outcome capture | `actual_outcomes` + `POST /decisions/{id}/outcome` | Real PostgreSQL integration tests passed | Browser recorded actual cost 600, actual delay 6, completed for Decision 50 | Mansi/Chetan | PASS |
| Operational closed loop | Decision -> outcome -> evaluation APIs | Real PostgreSQL tests passed | Browser completed record -> recommend -> execute -> outcome -> evaluation | Chetan | PASS |
| Decision ROI | ROI analytics endpoint and frontend | Real evaluated decisions returned computed ROI metrics | Browser displayed ROI for Decision 50 and analytics totals | Chetan/Prashant | PASS |
| Positive business outcomes | ROI analytics | Live analytics counted positive and negative outcomes from stored decisions | Browser displayed positive outcome count and rate | Chetan/Mansi | PASS |
| Feedback/evaluation UI | `frontend/src/App.jsx` | Frontend lint/build PASS | Real evaluation and ROI rendered in browser | Yoshita | PASS |

---

# Week 4 - Continuous Learning and Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | `backend/ml/evaluate.py` | Discrepancy tests passed | Browser evaluation returned `discrepancy_detected` | Chetan | PASS |
| Retraining trigger | `trigger_retraining_if_needed()` | Retraining trigger test passed | Decision 50 has a populated `retraining_triggered_at` in stored `decision_log` data | Chetan | PASS |
| XGBoost retraining workflow | `retrain_model()` | Retraining workflow test passed and model training executed | Updated model artifact checksum/timestamp recorded in final QA evidence | Chetan | PASS |
| Production continuous-learning workflow | Decision outcome -> evaluation -> retraining | Operational discrepancy case has stored retraining trigger metadata; updated model artifact was captured | Closed-loop browser workflow produced discrepancy and evaluation | Chetan | PASS |
| Final analyst workflow polish | React UI + API integration | Lint PASS; build PASS; `git diff --check` had no actual whitespace errors | Browser closed-loop workflow completed without workflow-blocking CORS/API failure | Yoshita | PASS |

---

# Required API Verification

| API | Verification | Status |
|---|---|---|
| `GET /health` | HTTP 200, `{"status":"ok"}` | PASS |
| `POST /predict/shipment-delay` | OpenAPI route present and backend prediction workflow verified | PASS |
| `POST /recommend` | Live PostgreSQL-backed request returned prediction and 3 alternatives | PASS |
| `POST /decisions` | Browser executed selected recommendation and returned Decision ID 50 | PASS |
| `GET /decisions/history` | Live stored decision history returned successfully | PASS |
| `POST /decisions/{id}/outcome` | Browser recorded actual outcome successfully for Decision 50 | PASS |
| `GET /decisions/{id}/evaluation` | Live evaluation returned predicted/actual/difference/ROI/status for Decision 50 | PASS |
| `GET /decisions/analytics/roi` | HTTP 200 with computed decision counts, positive rate and average ROI | PASS |

---

# Final Workflow

| Requirement | Evidence | Status |
|---|---|---|
| Prediction generated | Live `/recommend` returned `delivery_time_deviation`, predicted delay 5.67630672454834 | PASS |
| Recommendations generated | Three live solver-generated alternatives | PASS |
| Budget/time/capacity constraints enforced | Automated optimizer tests + live feasibility flags | PASS |
| React receives live backend response | Browser live backend workflow completed successfully after CORS configuration | PASS |
| Frontend displays live recommendation values | Three live recommendation cards rendered | PASS |
| Analyst selects recommendation | Air Freight selected in browser | PASS |
| Execute Decision | Browser/API returned Decision ID 50 and matching stored decision row | PASS |
| Database INSERT | Real PostgreSQL integration tests and browser write-back completed | PASS |
| Actual operational outcome | Decision 50 linked to Outcome 44: actual cost 600, delay 6, completed | PASS |
| Standalone evaluation | Evaluation tests passed | PASS |
| Operational closed-loop evaluation | Decision -> outcome -> evaluation completed in browser | PASS |
| Decision ROI from real outcomes | Decision 50 evaluation returned ROI 12.377519407267744% | PASS |
| Discrepancy detection | Decision 50 returned `discrepancy_detected` | PASS |
| Retraining trigger | Decision 50 stored `retraining_triggered_at` | PASS |
| Production continuous learning | DB-backed evaluation/retraining workflow verified | PASS |
| Full end-to-end acceptance workflow | Complete browser workflow executed with live backend/database | PASS |

---

# Automated QA Evidence

## Backend

`pytest backend/tests -v`

Latest verified result:

`14 passed`

## Real PostgreSQL

`$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v`

Latest verified result:

`2 passed, 1 warning`

## Frontend Lint

`npm.cmd --prefix frontend run lint`

Latest verified result:

PASS with no ESLint errors.

## Frontend Production Build

`npm.cmd --prefix frontend run build`

Latest verified result:

PASS; Vite 8.2.1; 19 modules transformed.

## Git whitespace check

`git diff --check`

Latest verified result:

No actual whitespace errors. On Windows, a CRLF conversion warning was observed for the traceability file.

PASS; no output.

# Real Dataset vs Operational Database Evidence

Historical dataset:

`data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv`

- 113097 historical rows
- 18 columns

PostgreSQL operational test database:

- Database: `supply_prescript_db`
- Required tables verified:
  1. `supply_chain_data`
  2. `predictions`
  3. `prescriptive_recommendations`
  4. `decision_log`
  5. `actual_outcomes`
- Real test records were used for final E2E verification.

The CSV historical row count is intentionally not presented as the PostgreSQL operational row count.

Supply-chain dataset contains 113097 rows.

# Decision 50 / SQL Evidence

The final E2E package includes a concrete API/database-linked Decision 50 evidence set.

Decision record:

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

Outcome record:

```text
outcome_id = 44
decision_id = 50
actual_cost = 600
actual_delay_days = 6
outcome_status = completed
evaluated_at = 2026-09-14 23:30:59.702662+05:30
```

Evaluation/history record:

```text
status = discrepancy_detected
predicted_cost = 684.7557795
actual_cost = 600
absolute_difference = 84.75577950000002
percentage_difference = 14.125963250000003
roi_percent = 12.377519407267744
threshold = 10
```

These values are tied to the stored Decision 50 and Outcome 44 records rather than being presented as an unreferenced UI snapshot.

Verified browser decision:

# ROI Analytics Evidence

Positive outcome definition:

`actual_cost <= expected_cost`

Latest verified backend analytics:

- total decisions: 8
- evaluated decisions: 8
- positive outcomes: 5
- negative outcomes: 3
- positive outcome rate: 62.5%
- average ROI: -0.30889857936569803%

---

# Model Evidence

Updated model artifact captured during final QA:

SHA-256:
`DBF30350C08ABA3958219B76C552C8BA847FC7B5534E5E75B4AD468A11BB2F2B`

Size:
`1372358 bytes`

LastWriteTime:
`2026-09-14 23:33:28`

---

# Evidence Policy

No fabricated screenshots, database rows, test results, or ROI values are used.

Historical CSV volume and PostgreSQL operational test data are explicitly distinguished. Final PASS decisions are based on implementation plus actual execution evidence that matches the requirement.
