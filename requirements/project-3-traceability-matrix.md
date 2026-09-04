# Supply Prescript — Project 3 Requirement Traceability Matrix

## Purpose

This file maps the Project 3 requirements to the implementation, verification
tests, and available evidence.

A requirement is marked PASS only when the implementation and actual
verification evidence exist.

---

## Status Definitions

- PASS — implemented and verified with actual evidence.
- IN PROGRESS — implementation is currently being developed.
- BLOCKED — required dependency is unavailable.
- NOT STARTED — work has not started.
- FAIL — implementation exists but does not satisfy the requirement.

---

# Week 1 — Predictive Baseline

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| XGBoost predictive baseline | `backend/ml/train.py`; trained model saved as `backend/models/shipment_delay_model.joblib` | `testing/week-2-validation.md` records actual model load and training metrics: MAE 3.4123, RMSE 3.8477, R² 0.1468 | Real prediction generated through `/recommend` | Chetan | PASS |
| Historical mock supply-chain data | `backend/data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` is used by the training workflow | Actual training run used 113097 rows, with 90477 training samples and 22620 testing samples | Dataset is used by the real model-training workflow | Mansi | PASS |
| Shipment-delay prediction | `backend/ml/predict.py`; `/predict/shipment-delay` and `/recommend` in `backend/app/main.py` | Real `/recommend` execution returned prediction `5.909985542297363` | Real backend prediction result captured | Chetan | PASS |
| React application scaffolding | `frontend/src/App.jsx` | Frontend implementation exists; no new end-to-end frontend prediction PASS claimed | Frontend UI is implemented | Yoshita | IN PROGRESS |
| PostgreSQL / Snowflake connection | No verified operational database connection | No actual database connection verification | No database connection demo | Mansi | NOT STARTED |

---

# Week 2 — Optimization & Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Business constraints defined | `backend/ml/optimizer.py`; `OptimizationInput` contains budget, allowed time, and available capacity | Budget, time, and capacity tests recorded in `testing/week-2-validation.md` | Real `/recommend` responses show constraint handling | Chetan/Mansi | PASS |
| SciPy linear-programming solver | `backend/ml/optimizer.py` uses `scipy.optimize.linprog` | Solver executed successfully through `/recommend` and returned a valid optimization result | Real recommendation returned by backend | Chetan | PASS |
| Three alternative actions | `backend/ml/optimizer.py` generates Air Freight, Secondary Supplier, and Delay Launch alternatives | Real `/recommend` response returned all three alternatives with actual values | Three backend-generated alternatives captured | Chetan | PASS |
| Three prescription cards | `frontend/src/App.jsx` renders recommendation cards | Backend alternatives are verified, but frontend end-to-end card integration is not separately verified in this validation | Three recommendation cards are present in frontend | Yoshita | IN PROGRESS |
| Cost displayed | `frontend/src/App.jsx` displays Cost for each recommendation, but real backend-to-frontend display is not verified | Backend API returned actual cost values: 684.75, 547.80, and 45.65 | Cost field exists in frontend, but verified real backend value display is not available | Yoshita | IN PROGRESS |
| Speed/time displayed | `frontend/src/App.jsx` displays Speed / Time for each recommendation, but real backend-to-frontend display is not verified | Backend API returned actual time values: 4.40, 6.40, and 13.909985542297363 | Speed / Time field exists in frontend, but verified real backend value display is not available | Yoshita | IN PROGRESS |
| Cost vs Speed trade-off | `frontend/src/App.jsx` contains Cost and Speed / Time fields for each recommendation | Backend API returned actual cost/time pairs for all three alternatives | Frontend comparison layout exists, but real backend values are not verified in the UI | Yoshita | IN PROGRESS |

---

# Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint verified | `backend/ml/optimizer.py` validates `alternative["cost"] <= budget` | Feasible budget 700 verified; impossible budget 40 returned no feasible solution and no recommendation | Real API constraint responses captured | Chetan/Prashant | PASS |
| Execute Decision button | `frontend/src/App.jsx` contains Execute Decision button, currently disabled | Write-back workflow has not yet been executed | Button is visible but not executable | Yoshita/Chetan | IN PROGRESS |
| Database INSERT verified | No verified operational database INSERT evidence | No MySQL INSERT/SELECT verification completed | No database write-back demo | Chetan/Mansi | BLOCKED |

---

# Week 3 — Closed Loop

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Evaluation script | No Week 3 end-to-end integration verified in this validation cycle | `testing/week-3-test-plan.md` defines evaluation checks | No end-to-end evaluation demo recorded in this cycle | Chetan/Prashant | NOT STARTED |
| Predicted cost comparison | `frontend/src/App.jsx` contains Predicted Cost vs Actual Cost UI | No real cost-comparison workflow verified in this validation cycle | UI empty state only | Chetan | NOT STARTED |
| Actual historical outcome | No verified operational historical outcome integration | No actual outcome verification | No actual outcome displayed | Mansi | NOT STARTED |
| Discrepancy calculation | No verified end-to-end discrepancy workflow | No Week 3 end-to-end verification recorded here | No real discrepancy demo | Chetan | NOT STARTED |
| Decision ROI | `frontend/src/App.jsx` contains Decision ROI UI | No real ROI workflow verified in this validation cycle | ROI section exists with no verified real outcome data | Chetan/Prashant | IN PROGRESS |
| Positive business outcomes | `frontend/src/App.jsx` contains Positive Outcomes UI | No real evaluated outcomes verified | Empty state only | Chetan/Mansi | NOT STARTED |
| ROI analytics UI | `frontend/src/App.jsx` contains Feedback / Decision ROI and evaluation history | UI implementation exists; no end-to-end ROI verification in this cycle | ROI analytics section is visible | Yoshita | IN PROGRESS |

---

# Week 4 — Continuous Learning & Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | No verified operational implementation | No actual verification evidence in this cycle | No demo evidence | Chetan | NOT STARTED |
| Retraining trigger | No verified operational implementation | No actual verification evidence | No demo evidence | Chetan | NOT STARTED |
| XGBoost retraining workflow | `backend/ml/train.py` provides a training workflow, but continuous retraining trigger is not verified | No continuous-learning verification | No continuous retraining demo | Chetan | IN PROGRESS |
| Final analyst workflow polish | `frontend/src/App.jsx` contains Shipment Risk, Recommendations, Decision, Feedback / ROI and Backend Connection sections | No final end-to-end PASS evidence | Frontend workflow structure is present | Yoshita | IN PROGRESS |

---

# Final Workflow

| Requirement | Evidence | Status |
|---|---|---|
| Analyst reviews prediction | Real backend prediction generated through `/recommend`; frontend end-to-end display not separately verified | IN PROGRESS |
| Analyst reviews recommendations | Backend returns three verified alternatives; frontend end-to-end integration not separately verified | IN PROGRESS |
| Analyst compares Cost vs Speed | Backend returned verified cost/time values, but frontend end-to-end display is not separately verified | IN PROGRESS |
| Analyst participates in decision | Recommendation selection exists in `frontend/src/App.jsx` | IN PROGRESS |
| Analyst executes decision | Execute Decision button exists but is disabled | IN PROGRESS |
| Decision written to database | No verified database write-back evidence | BLOCKED |
| Actual outcome used for evaluation | No verified operational historical outcome integration | NOT STARTED |
| Evaluation feeds back into learning | No verified continuous-learning workflow | NOT STARTED |

---

# Verified Week 1 / Week 2 Evidence Summary

## XGBoost Model

Model path:

`backend/models/shipment_delay_model.joblib`

Actual model load:

`Model loaded successfully`

Actual training/evaluation results:

| Metric | Result |
|---|---:|
| Rows used | 113097 |
| Training samples | 90477 |
| Testing samples | 22620 |
| MAE | 3.4123 |
| RMSE | 3.8477 |
| R² | 0.1468 |

Actual prediction generated through `/recommend`:

`5.909985542297363`

---

## `/recommend` Verification

Actual prediction:

`5.909985542297363`

### Option 1 — Air Freight

- Cost: `684.75`
- Time: `4.40`
- Capacity: `50`
- Expected impact: `1.4774963855743408`
- Feasible: `true`

### Option 2 — Secondary Supplier

- Cost: `547.80`
- Time: `6.40`
- Capacity: `50`
- Expected impact: `2.6594934940338137`
- Feasible: `true`

### Option 3 — Delay Launch

- Cost: `45.65`
- Time: `13.909985542297363`
- Capacity: `50`
- Expected impact: `5.909985542297363`
- Feasible: `true`

Recommended option:

`Air Freight`

---

## Budget Verification

### Feasible Budget

Configured budget:

`700`

All three alternatives satisfied the budget:

- `684.75 <= 700`
- `547.80 <= 700`
- `45.65 <= 700`

Recommendation:

`Air Freight`

### Impossible Budget

Configured budget:

`40`

All alternatives exceeded the budget.

Result:

- `feasible_alternatives = []`
- `recommended_option = null`
- Status: `no_feasible_solution`

No invalid recommendation was returned.

---

## Time Constraint Verification

Configured allowed time:

`5`

| Option | Time | Feasible |
|---|---:|---|
| Air Freight | 4.40 | Yes |
| Secondary Supplier | 6.40 | No |
| Delay Launch | 13.909985542297363 | No |

Recommendation:

`Air Freight`

The recommendation satisfies the configured maximum time.

---

## Capacity Constraint Verification

Configured available capacity:

`40`

Shipment capacity:

`50`

| Option | Capacity | Feasible |
|---|---:|---|
| Air Freight | 50 | No |
| Secondary Supplier | 50 | No |
| Delay Launch | 50 | No |

Result:

- `feasible_alternatives = []`
- `recommended_option = null`
- Status: `no_feasible_solution`

No invalid recommendation was returned.

---

# Validation Status Summary

| Area | Status |
|---|---|
| XGBoost predictive baseline | PASS |
| Historical supply-chain dataset used by training | PASS |
| Shipment-delay prediction | PASS |
| SciPy optimization | PASS |
| Three alternative actions | PASS |
| Budget constraint | PASS |
| Time constraint | PASS |
| Capacity constraint | PASS |
| Backend cost values | PASS |
| Backend speed/time values | PASS |
| Frontend cost display | IN PROGRESS |
| Frontend speed/time display | IN PROGRESS |
| Cost vs Speed frontend integration | IN PROGRESS |
| Frontend prescription-card integration | IN PROGRESS |
| Execute Decision | IN PROGRESS |
| Database INSERT / write-back | BLOCKED |
| Closed-loop evaluation | NOT STARTED |
| Continuous learning | IN PROGRESS |

---

# Evidence Rule

No requirement is marked PASS based only on documentation, planned tests,
UI placeholders, or expected behavior.

A PASS requires:

1. Implementation exists.
2. The implementation is executed or otherwise verified.
3. Actual test evidence is available.
4. The evidence supports the specific requirement.

No fabricated values or fabricated PASS results should be added.

---

# Current Remaining Critical Gaps

1. PostgreSQL / Snowflake operational connection
2. Frontend end-to-end prediction/recommendation integration
3. Execute Decision backend write-back
4. MySQL INSERT and SELECT verification
5. Closed-loop evaluation integration
6. Actual historical outcome integration
7. Decision ROI from actual outcomes
8. Continuous-learning trigger and workflow
9. Final end-to-end workflow verification