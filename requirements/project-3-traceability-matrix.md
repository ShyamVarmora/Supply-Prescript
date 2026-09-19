# Supply Prescript - Project 3 Requirement Traceability Matrix

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Verified integrated status — 12/09/2026

> The PASS statuses in the sections below represent the successful integrated PostgreSQL/browser verification performed on 12/09/2026. Documentation-only cleanup followed; no backend/frontend/database feature changes were introduced afterward.

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
| XGBoost predictive baseline | `backend/ml/train.py`; `models/shipment_delay_model.joblib` | Actual dataset/training evidence: 113097 rows, 90477 training samples, 22620 testing samples; MAE/RMSE/R2 recorded | Model loaded and backend prediction verified | Chetan | PASS |
| Historical supply-chain data | `data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` | 113097 rows and 18 columns verified | Real dataset used by workflow | Mansi | PASS |
| Shipment-delay prediction | `backend/ml/predict.py`; `POST /predict/shipment-delay`; `POST /recommend` | Final live `/recommend` returned prediction target `delivery_time_deviation` and predicted delay 5.67630672454834 | Browser displayed prediction | Chetan | PASS |
| React application | `frontend/` React/Vite application | `npm.cmd --prefix frontend run lint` PASS; production build PASS, 19 modules transformed | Browser UI loaded and completed closed-loop workflow | Yoshita | PASS |
| PostgreSQL operational database | FastAPI + psycopg + PostgreSQL schema | Historical CSV: 113097 rows. PostgreSQL operational test database connected and verified with real test records used in the final E2E workflow. Five required tables verified. | Browser write-back/evaluation used live PostgreSQL data | Mansi/Chetan | PASS |

---

# Week 2 - Optimization and Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Budget constraint | `backend/ml/optimizer.py` | Automated optimizer tests passed; constrained scenarios verified | Final live recommendation scenario used budget 700 | Chetan | PASS |
| Time constraint | `backend/ml/optimizer.py` | Automated optimizer tests passed including time-failure scenario | Alternatives expose time values and feasibility | Chetan | PASS |
| Capacity constraint | `backend/ml/optimizer.py` | Automated optimizer tests passed including capacity-failure scenario | Alternatives expose capacity validity | Chetan | PASS |
| SciPy optimization | `scipy.optimize.linprog` | Optimizer workflow tests passed | Live `/recommend` returned optimization status `optimal` | Chetan | PASS |
| Three solver-generated alternatives | `backend/ml/optimizer.py` | Optimizer test confirms three alternatives | Browser displayed Air Freight, Secondary Supplier, Delay Launch | Chetan | PASS |
| Three feasible alternatives | `/recommend` | Final verified scenario: budget 700, time 20, capacity 100 | Browser displayed all three as feasible | Chetan | PASS |
| Three prescription cards | `frontend/src/App.jsx` | Frontend lint/build PASS | Browser displayed three live backend-backed cards | Yoshita | PASS |
| Cost display | `frontend/src/App.jsx` | Live backend values persisted in recommendations | Browser displayed recommendation costs | Yoshita | PASS |
| Speed/time display | `frontend/src/App.jsx` | Live backend recommendation time values returned | Browser displayed time values | Yoshita | PASS |
| Cost vs speed trade-off | Frontend recommendation cards | Automated/frontend verification and live backend response | Browser showed cost/time trade-offs for all alternatives | Chetan/Yoshita | PASS |

---

# Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint | Optimizer feasibility validation | Optimizer tests passed for normal and budget-failure scenarios | Live recommendation cards showed feasibility | Chetan/Prashant | PASS |
| Execute Decision | `frontend/src/App.jsx`; `POST /decisions` | Real PostgreSQL integration tests passed | Browser executed selected recommendation and returned Decision ID | Yoshita/Chetan | PASS |
| Real database INSERT | `decision_log`, `prescriptive_recommendations`, `actual_outcomes` | Real PostgreSQL write-back tests passed | Browser decision/outcome flow completed against live DB | Chetan/Mansi | PASS |
| Negative write-back validation | Decision validation in `backend/app/main.py` | Invalid IDs, wrong record/recommendation, wrong action and infeasible action rejection covered by automated validation/tests and prior live API verification | Invalid actions are rejected; infeasible recommendation cannot be selected | Chetan/Mansi | PASS |

---

# Week 3 - Evaluation and Closed Loop

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Standalone evaluation | `backend/ml/evaluate.py` | Evaluation workflow tests passed | Evaluation result displayed in browser | Chetan/Prashant | PASS |
| Predicted vs actual comparison | `evaluate_decision()` | Difference and percentage calculations passed automated tests | Browser showed predicted cost, actual cost, difference and percentage | Chetan/Prashant | PASS |
| Missing actual outcome handling | Evaluation workflow | Pending evaluation test passed | Pending state is shown when outcome is absent | Chetan | PASS |
| Actual outcome capture | `actual_outcomes` + `POST /decisions/{id}/outcome` | Real PostgreSQL integration tests passed | Browser recorded actual cost 600, actual delay 6, completed | Mansi/Chetan | PASS |
| Operational closed loop | Decision -> outcome -> evaluation APIs | Real PostgreSQL tests passed | Browser completed record -> recommend -> execute -> outcome -> evaluation | Chetan | PASS |
| Decision ROI | ROI analytics endpoint and frontend | All decision-log rows are counted; evaluated metrics use one latest non-null-cost outcome per decision; ROI uses positive expected costs | Browser displayed ROI for the evaluated decision and analytics totals | Chetan/Prashant | PASS |
| Positive business outcomes | ROI analytics | Live analytics counted positive and negative outcomes from stored decisions | Browser displayed positive outcome count and rate | Chetan/Mansi | PASS |
| Feedback/evaluation UI | `frontend/src/App.jsx` | Frontend lint/build PASS | Real evaluation and ROI rendered in browser | Yoshita | PASS |

---

# Week 4 - Continuous Learning and Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | `backend/ml/evaluate.py` | Discrepancy tests passed | Browser evaluation returned `discrepancy_detected` | Chetan | PASS |
| Retraining trigger | `trigger_retraining_if_needed()` | Retraining trigger test passed | Real discrepancy evaluation triggered retraining in operational workflow | Chetan | PASS |
| XGBoost retraining workflow | `retrain_model()` | Retraining workflow test passed and model training executed | Model artifact updated during verified retraining workflow | Chetan | PASS |
| Discrepancy-triggered XGBoost retraining | Decision outcome -> evaluation -> retraining trigger | Operational evaluation returned retraining trigger metadata for discrepancy case | Closed-loop browser workflow produced discrepancy and evaluation | Chetan | PASS |
| Final analyst workflow polish | React UI + API integration | Lint PASS; build PASS; `git diff --check` PASS | Browser closed-loop workflow completed without workflow-blocking CORS/API failure | Yoshita | PASS |

---

# Required API Verification

| API | Verification | Status |
|---|---|---|
| `GET /health` | HTTP 200, `{"status":"ok"}` | PASS |
| `POST /predict/shipment-delay` | OpenAPI route present and backend prediction workflow verified | PASS |
| `POST /recommend` | Live PostgreSQL-backed request returned prediction and 3 alternatives | PASS |
| `POST /decisions` | Browser executed selected recommendation and returned Decision ID | PASS |
| `GET /decisions/history` | Live stored decision history returned successfully | PASS |
| `POST /decisions/{id}/outcome` | Browser recorded actual outcome successfully | PASS |
| `GET /decisions/{id}/evaluation` | Live evaluation returned predicted/actual/difference/ROI/status | PASS |
| `GET /decisions/analytics/roi` | HTTP 200 with all decision counts, latest-outcome evaluation counts, positive rate and average ROI | PASS |

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
| Execute Decision | Browser returned Decision ID 50 | PASS |
| Database INSERT | Real PostgreSQL integration tests and browser write-back completed | PASS |
| Actual operational outcome | Actual cost 600, delay 6, completed | PASS |
| Standalone evaluation | Evaluation tests passed | PASS |
| Operational closed-loop evaluation | Decision -> outcome -> evaluation completed in browser | PASS |
| Decision ROI from real outcomes | Browser displayed ROI and analytics based on stored outcomes | PASS |
| Discrepancy detection | Evaluation returned `discrepancy_detected` | PASS |
| Retraining trigger | Discrepancy evaluation triggered retraining | PASS |
| Discrepancy-triggered XGBoost retraining | Evaluation returned `discrepancy_detected` and invoked the retraining path | PASS |
| Full end-to-end acceptance workflow | Complete browser workflow executed with live backend/database | PASS |

---

# Automated QA Evidence — 12/09/2026 integrated verification

## Backend

`pytest backend/tests -v`

Result:

`14 passed, 0 failed, 0 skipped, 1 warning`

## Real PostgreSQL

`$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v`

Result:

`2 passed, 0 failed, 1 warning`

## Frontend Lint

`npm.cmd --prefix frontend run lint`

Result:

PASS with no ESLint errors.

## Frontend Production Build

`npm.cmd --prefix frontend run build`

Result:

PASS; Vite 8.2.1; 19 modules transformed.

## Git whitespace check

`git diff --check`

Result:

PASS; no output.

---

# Real Dataset Evidence

Supply-chain dataset contains 113097 rows.

Five required PostgreSQL tables verified:

1. `supply_chain_data`
2. `predictions`
3. `prescriptive_recommendations`
4. `decision_log`
5. `actual_outcomes`

---

# Real Browser E2E Evidence

The final browser workflow used a real supply-chain record and live backend/database services.

Observed flow:

`Record -> Generate -> Prediction -> 3 Alternatives -> Feasible Selection -> Execute -> Decision ID -> Actual Outcome -> Evaluation -> ROI -> History -> ROI Analytics`

Verified browser decision:

- Decision ID: 50
- Selected action: Air Freight
- Actual cost: 600
- Actual delay: 6
- Outcome status: completed
- Evaluation status: discrepancy_detected
- Predicted cost: approximately 684.76
- Absolute difference: approximately 84.76
- Percentage difference: approximately 14.13%
- ROI: approximately 12.38%

The ROI analytics section also displayed counts derived from stored decisions, including positive and negative outcomes and average ROI.

---

# Evidence Policy

No fabricated screenshots, database rows, test results, or ROI values are used.

The final status is based on executed tests, live PostgreSQL behavior, backend responses, and the completed browser workflow.

---

## Final integrated verification — 17/09/2026

Historical evidence above is retained for audit continuity.
### Direct shipment-delay prediction

Actual local verification:
POST /predict/shipment-delay → HTTP 200
prediction_target = delivery_time_deviation
predicted_delivery_time_deviation = 5.67630672454834

### PostgreSQL operational evidence

Historical CSV: 113097 rows.
PostgreSQL operational test database connected and verified with real test records used in the final E2E workflow.
Five required tables verified.

The current final-QA PC does not have PostgreSQL available on localhost:5432, so the latest local RUN_REAL_DB rerun is recorded as BLOCKED rather than claimed as passed.

### Current automated verification

pytest backend/tests -v -W always → 12 passed, 2 skipped, 1 warning in 12.37s.

### Current frontend verification

npm.cmd --prefix frontend run lint → PASS.
npm.cmd --prefix frontend run build → PASS; 19 modules transformed.
git diff --check → clean.

### Historical SQL evidence retained

Decision 50: record_id 1, recommendation_id 109, selected_action Air Freight, decision_status SELECTED.
Outcome 44: decision_id 50, actual_cost 600, actual_delay_days 6, outcome_status completed.

Retraining is documented as discrepancy-triggered XGBoost retraining only. No production continuous-learning deployment is claimed.

### Explicit final API and SQL evidence

Current local direct prediction: `POST /predict/shipment-delay` → `HTTP 200`

```json
{"prediction_target":"delivery_time_deviation","predicted_delivery_time_deviation":5.67630672454834}
```

Historical SQL evidence includes persisted prediction record_id=1 with target delivery_time_deviation and value 6.1492509841918945; recommendation 109 for record 1 was Air Freight; Decision 50 was record 1 / recommendation 109 / Air Freight / SELECTED; Outcome 44 was decision 50 / cost 600 / delay 6 / completed.

Current backend result: `12 passed, 2 skipped, 1 warning in 12.37s`.

Exact warning: `DeprecationWarning: The anyio.abc.BlockingPortal alias is deprecated, use anyio.from_thread.BlockingPortal instead.`

Current local PostgreSQL integration: `BLOCKED — 2 tests collected; first test reached the PostgreSQL connection and the run ended with KeyboardInterrupt after 34.96s; no PostgreSQL test passed.`


---

## QA-machine rerun — 17/09/2026

This is an environment-only rerun on the final-QA machine. It does not replace the successful 12/09/2026 integrated verification and does not indicate that the implementation stopped working.

- Backend unit/integration suite: PASS — 12 passed, 2 skipped, 1 warning in 12.37s.
- PostgreSQL integration suite: BLOCKED — PostgreSQL was unavailable on localhost:5432; 2 tests were collected, the first test reached the connection attempt, and the run ended with KeyboardInterrupt after 34.96s. No current PostgreSQL pass result is claimed.
- Frontend lint: PASS.
- Frontend production build: PASS; 19 modules transformed.
- Repository hygiene: PASS; git diff --check clean.
