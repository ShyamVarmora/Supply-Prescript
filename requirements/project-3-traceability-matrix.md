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
| XGBoost predictive baseline | backend/ml/train.py; model saved as models/shipment_delay_model.joblib | Actual training: 113097 rows, 90477 training samples, 22620 testing samples, MAE 3.420092708832049, RMSE 3.8571221151353994, R2 0.14264861146107266 | Model loaded successfully and backend prediction verified | Chetan | PASS |
| Historical supply-chain data | data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv | Actual dataset load: 113097 rows and 18 columns | Real dataset used by training workflow | Mansi | PASS |
| Shipment-delay prediction | backend/ml/predict.py; /predict/shipment-delay and /recommend | Real /recommend returned predicted_delay = 5.330718994140625 | Real backend prediction response captured | Chetan | PASS |
| React application scaffolding | frontend/ React/Vite application | npm run build completed successfully; 19 modules transformed | Frontend loaded at http://localhost:5173 | Yoshita | PASS |
| PostgreSQL / Snowflake connection | No verified operational implementation | No successful PostgreSQL/Snowflake connection execution verified | No database connection demo | Mansi | NOT STARTED |

---

# Week 2 - Optimization and Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Budget constraint | backend/ml/optimizer.py | Budget 700 case passed; budget 40 returned no feasible solution | Real optimizer/API output captured | Chetan | PASS |
| Time constraint | backend/ml/optimizer.py | Allowed time 5: Air Freight feasible; Secondary Supplier and Delay Launch infeasible | Real optimizer output captured | Chetan | PASS |
| Capacity constraint | backend/ml/optimizer.py | Available capacity 40 with shipment capacity 50 returned no feasible solution | Real optimizer output captured | Chetan | PASS |
| SciPy optimization | scipy.optimize.linprog | Optimizer executed successfully and returned valid result | Real /recommend result captured | Chetan | PASS |
| Three solver-generated alternatives | backend/ml/optimizer.py | Actual alternatives count = 3 | Air Freight, Secondary Supplier, Delay Launch returned | Chetan | PASS |
| Three feasible alternatives in one verified scenario | Optimizer API | Budget 700, allowed time 20, capacity 100: all three alternatives feasible | Real /recommend output captured | Chetan | PASS |
| Three prescription cards | frontend/src/App.jsx | Card structure exists; live backend request blocked by CORS | Live backend-backed cards not verified | Yoshita | IN PROGRESS |
| Cost display | frontend/src/App.jsx | Backend returned actual costs 684.7557795, 547.8046236, 45.6503853 | Live frontend rendering not verified because browser request failed | Yoshita | IN PROGRESS |
| Speed / time display | frontend/src/App.jsx | Backend returned actual times 4.4, 6.4, 13.330718994140625 | Live frontend rendering not verified because browser request failed | Yoshita | IN PROGRESS |
| Cost vs Speed trade-off | Backend optimizer + frontend fields | Backend cost/time pairs verified for all three alternatives | Live frontend comparison not verified | Chetan/Yoshita | IN PROGRESS |

---

# Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint verified | Optimizer rejects alternatives whose cost exceeds budget | Budget 700 audit passed; budget 40 returned no recommendation | Real API/optimizer outputs captured | Chetan/Prashant | PASS |
| Execute Decision | frontend/src/App.jsx | UI control exists; end-to-end execution not verified | Database-backed execution not proven | Yoshita/Chetan | IN PROGRESS |
| Real database INSERT | No verified operational database write-back implementation | No real INSERT followed by SELECT evidence | No database write-back demo | Chetan/Mansi | BLOCKED |
| Negative write-back validation | No verified operational DB write-back implementation | Invalid record, invalid recommendation, cross-record recommendation, wrong action, and infeasible-action rejection not executed | No negative write-back evidence | Chetan/Mansi | NOT STARTED |

---

# Week 3 - Evaluation and Closed Loop

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Standalone evaluation script | backend/ml/evaluate.py with EvaluationRecord and evaluate_decision() | 10 evaluation tests executed; all 10 passed | Standalone evaluation output captured | Chetan/Prashant | PASS |
| Predicted vs actual discrepancy | evaluate_decision() | Exact match, normal difference, threshold boundary, above-threshold cases passed | Standalone evaluator output captured | Chetan/Prashant | PASS |
| Missing actual outcome handling | evaluate_decision() | actual_cost=None returned pending | Standalone evaluator output captured | Chetan/Prashant | PASS |
| Actual historical outcome integration | Database actual_outcomes source | No real database-backed actual outcome evidence | No historical outcome demo | Mansi/Chetan | NOT STARTED |
| Operational predicted-vs-actual closed loop | Evaluation connected to decision/outcome storage | Unit-level evaluator passes; operational loop not executed | No complete closed-loop demo | Chetan | IN PROGRESS |
| Decision ROI from actual evaluated decisions | ROI workflow | No real evaluated decision/outcome data or verified ROI result | No real ROI output verified | Chetan/Prashant | IN PROGRESS |
| Positive business outcomes | Outcome workflow | No real positive outcome evidence | No actual outcome demo | Chetan/Mansi | NOT STARTED |
| Feedback / evaluation UI | Frontend evaluation/feedback sections | UI structure exists; live evaluation data unavailable | No real evaluation data displayed | Yoshita | IN PROGRESS |

---

# Week 4 - Continuous Learning and Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | backend/ml/evaluate.py | Predicted 500, actual 600: 16.666666666666664 percent discrepancy_detected | Standalone discrepancy output captured | Chetan | PASS |
| Retraining trigger | trigger_retraining_if_needed() | Actual test returned triggered=True | Standalone trigger execution captured | Chetan | PASS |
| XGBoost retraining workflow | retrain_model() | Actual training completed and temporary QA model created | Temporary model evidence captured; cleanup completed | Chetan | PASS |
| Production continuous-learning workflow | No verified DB-driven production loop | Full decision -> outcome -> evaluation -> retraining workflow not executed | No complete continuous-learning demo | Chetan | IN PROGRESS |
| Final analyst workflow polish | frontend sections and workflow | Frontend build passed; live backend integration failed due CORS | UI structure present | Yoshita | IN PROGRESS |

---

# Final Workflow

| Requirement | Evidence | Status |
|---|---|---|
| Prediction generated | Real /recommend returned 5.330718994140625 | PASS |
| Recommendations generated | Three solver-generated alternatives returned | PASS |
| Budget/time/capacity constraints enforced | Normal, restricted and budget-audit tests passed | PASS |
| React receives live backend response | Browser request failed with CORS policy error | FAIL |
| Frontend displays live backend recommendation values | Not verified because browser request failed | IN PROGRESS |
| Analyst selects recommendation | Selection logic exists in frontend | IN PROGRESS |
| Execute Decision | UI exists; end-to-end execution not verified | IN PROGRESS |
| Database INSERT | No actual INSERT/SELECT evidence | BLOCKED |
| Actual operational outcome | No verified database-backed actual outcome | NOT STARTED |
| Standalone evaluation | 10/10 evaluation tests passed | PASS |
| Operational closed-loop evaluation | Not connected to real decision/outcome storage | IN PROGRESS |
| Decision ROI from real outcomes | No verified real outcome-based ROI | IN PROGRESS |
| Discrepancy detection | Standalone test passed | PASS |
| Retraining trigger | Standalone trigger test passed | PASS |
| Production continuous learning | Full DB-driven loop not verified | IN PROGRESS |
| Full end-to-end acceptance workflow | Required frontend, database and outcome links are incomplete | FAIL |

---

# Verified Actual Evidence

## XGBoost Training

Dataset: D:\Supply-Prescript\data\raw\dynamic_supply_chain_logistics_dataset_with_country.csv
Rows: 113097
Training samples: 90477
Testing samples: 22620
MAE: 3.420092708832049
RMSE: 3.8571221151353994
R2: 0.14264861146107266

## Prediction

Prediction target: delivery_time_deviation
Predicted delay: 5.330718994140625

## Week 3 Evaluation

10/10 evaluation tests passed.
Exact match: within_expected_range
Normal difference: within_expected_range
Threshold boundary: within_expected_range
Above threshold: discrepancy_detected
Missing actual: pending
Zero-to-zero: within_expected_range
Predicted 500 / actual 0: discrepancy_detected
Negative predicted cost: validation error
Negative actual cost: validation error
Empty decision ID: validation error

## Week 4 Retraining

Predicted cost: 500
Actual cost: 600
Discrepancy: 16.666666666666664 percent
Evaluation status: discrepancy_detected
Retraining triggered: True
Training rows: 113097
Training samples: 90477
Testing samples: 22620
MAE: 3.420092708832049
RMSE: 3.8571221151353994
R2: 0.14264861146107266
Temporary QA model created: 1356542 bytes
Temporary QA model cleanup completed
