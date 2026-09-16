# Supply Prescript - Project 3 Requirement Traceability Matrix

## Purpose

This matrix maps Project 3 requirements to implementation and final verification evidence for the integrated `devops` implementation.

PASS is used only where implementation and actual execution evidence support the specific requirement.

## Week 1 - Predictive Baseline

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| XGBoost predictive baseline | `backend/ml/train.py`; `models/shipment_delay_model.joblib` | Historical CSV: 113097 rows; 90477 training samples; 22620 testing samples; actual metrics recorded | Model loaded and backend prediction verified | Chetan | PASS |
| Historical supply-chain data | `data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` | 113097 historical CSV rows, 18 columns | Record 1 used in final workflow | Mansi | PASS |
| Shipment-delay prediction | `backend/ml/predict.py`; `/predict/shipment-delay`; `/recommend` | Live recommendation workflow returned `delivery_time_deviation` prediction for record 1 | Browser prediction displayed | Chetan | PASS |
| React application | `frontend/` | Frontend lint/build passed | Browser closed-loop workflow completed | Yoshita | PASS |
| PostgreSQL operational test database | FastAPI + psycopg + PostgreSQL schema | `supply_prescript_db` connected; five required tables verified; real test records used | Browser write-back/evaluation used PostgreSQL test data | Mansi/Chetan | PASS |

## Week 2 - Optimization and Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Budget constraint | `backend/ml/optimizer.py` | Normal case and budget 40 hard-failure case verified | Final normal case used budget 700 | Chetan | PASS |
| Time constraint | `backend/ml/optimizer.py` | Restrictive time handling covered by optimizer tests | Alternatives expose time/feasibility values | Chetan | PASS |
| Capacity constraint | `backend/ml/optimizer.py` | Restrictive capacity handling covered by optimizer tests | Alternatives expose capacity feasibility | Chetan | PASS |
| SciPy optimization | `scipy.optimize.linprog` | Optimizer workflow executed | Live `/recommend` returned optimization result | Chetan | PASS |
| Three alternatives | `backend/ml/optimizer.py` | Exactly three alternatives generated | Air Freight, Secondary Supplier, Delay Launch rendered | Chetan/Yoshita | PASS |
| Three feasible alternatives | `/recommend` | Budget 700, allowed time 20, capacity 100 returned three feasible alternatives | Browser displayed all three as feasible | Chetan | PASS |
| Recommendation cards | `frontend/src/App.jsx` | Lint/build passed | Three live backend-backed cards rendered | Yoshita | PASS |
| Cost vs speed trade-off | Recommendation data/UI | Actual cost/time values verified | Browser showed alternatives and trade-offs | Chetan/Yoshita | PASS |

## Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint | Optimizer feasibility validation | Budget 40 hard-failure case returned no feasible alternative | Feasibility shown in recommendations | Chetan/Prashant | PASS |
| Execute Decision | `POST /decisions` + frontend flow | Decision 50 persisted in PostgreSQL | Browser executed selected Air Freight recommendation | Yoshita/Chetan | PASS |
| Real database INSERT | `decision_log`, `actual_outcomes` | SQL verification completed | Browser decision/outcome flow completed | Chetan/Mansi | PASS |
| Negative write-back validation | Decision validation in backend | Invalid identifiers/actions are rejected by validation/tests | Infeasible options are not selectable | Chetan/Mansi | PASS |

## Week 3 - Evaluation and ROI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Predicted vs actual comparison | `evaluate_decision()` | Decision 50: predicted 684.7557795 vs actual 600; difference and percentage calculated | Browser displayed evaluation | Chetan/Prashant | PASS |
| Actual outcome capture | `actual_outcomes` + outcome API | Outcome 44 linked to Decision 50 | Browser recorded actual cost 600, delay 6, completed | Mansi/Chetan | PASS |
| Decision ROI | Evaluation + ROI analytics | Decision 50 ROI = 12.377519407267744%; analytics returned stored aggregate metrics | Browser displayed ROI and analytics | Chetan/Prashant | PASS |
| Decision history | `/decisions/history` | Stored decision/evaluation data returned | Browser history displayed | Chetan | PASS |
| Feedback/evaluation UI | React UI | Lint/build passed | Evaluation and ROI rendered | Yoshita | PASS |

## Week 4 - Closed-Loop Discrepancy-Triggered Retraining and Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | `backend/ml/evaluate.py` | Discrepancy evaluation verified | `discrepancy_detected` observed | Chetan | PASS |
| Retraining trigger | `trigger_retraining_if_needed()` | Decision 50 has populated `retraining_triggered_at` | Trigger metadata captured in final evidence | Chetan | PASS |
| XGBoost retraining workflow | `retrain_model()` | Retraining workflow test passed and model training executed | Updated model artifact checksum/timestamp recorded | Chetan | PASS |
| Closed-loop discrepancy-triggered retraining | Decision outcome -> evaluation -> discrepancy -> retraining | Operational discrepancy case and updated artifact evidence recorded | Closed-loop browser workflow completed through evaluation | Chetan | PASS |
| Final analyst workflow polish | React UI + API integration | Lint/build passed; diff check had no actual errors | Browser workflow completed without blocking CORS/API failure | Yoshita | PASS |

## Required API Verification

| API | Verification | Status |
|---|---|---|
| `GET /health` | HTTP 200, `{"status":"ok"}` | PASS |
| `POST /predict/shipment-delay` | Backend prediction workflow verified | PASS |
| `POST /recommend` | Live PostgreSQL-backed request returned prediction and 3 alternatives | PASS |
| `POST /decisions` | Decision 50 created | PASS |
| `GET /decisions/history` | Stored decision history returned | PASS |
| `POST /decisions/{id}/outcome` | Outcome 44 recorded for Decision 50 | PASS |
| `GET /decisions/{id}/evaluation` | Evaluation returned predicted/actual/difference/ROI/status | PASS |
| `GET /decisions/analytics/roi` | Aggregated ROI metrics returned | PASS |

## PostgreSQL SQL Verification Evidence

Database: `supply_prescript_db`

Required-table query:

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

Real-record query:

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

Decision SQL query:

```sql
SELECT decision_id, record_id, recommendation_id, selected_action,
       expected_cost, decision_status, retraining_triggered_at
FROM decision_log
WHERE decision_id = 50;
```

Actual output:

```text
decision_id=50 | record_id=1 | recommendation_id=109 | Air Freight | 684.7557795 | SELECTED | 2026-09-14 23:30:59.769236+05:30
```

Outcome SQL query:

```sql
SELECT outcome_id, decision_id, actual_cost, actual_delay_days, outcome_status
FROM actual_outcomes
WHERE decision_id = 50;
```

Actual output:

```text
outcome_id=44 | decision_id=50 | actual_cost=600 | actual_delay_days=6 | completed
```

## Final Automated QA Evidence

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
PASS; no actual whitespace errors; Windows LF/CRLF conversion warning observed
```

## Evidence Integrity

Historical CSV volume is explicitly distinguished from PostgreSQL operational test records. Decision 50 / Outcome 44 and ROI values are the same dataset referenced by the final E2E and final QA documents. No fabricated screenshots, SQL, test results, or ROI values are asserted.
