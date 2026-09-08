# Supply Prescript - Final E2E Evidence

## Purpose

This document records the final Project 3 end-to-end QA verification.

PASS is used only where implementation and actual execution evidence support the specific step.

Database-dependent steps are marked BLOCKED or NOT VERIFIED when the required database runtime or write-back evidence is unavailable.

---

## Final E2E Workflow

| Step | Workflow Requirement | Actual Evidence / Result | Status |
|---|---|---|---|
| 1 | Database started | PostgreSQL client/service was not available on the office PC; Docker was also not installed | BLOCKED |
| 2 | Dataset loaded | Real dataset `data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv` loaded; 113097 rows and 18 columns verified | PASS |
| 3 | Record selected | Backend prediction/recommendation testing was executed using valid request data; no database-backed record selection was verified | IN PROGRESS |
| 4 | Prediction generated | Real `/recommend` execution returned predicted delay `5.330718994140625` | PASS |
| 5 | 3 alternatives generated | Real optimizer returned Air Freight, Secondary Supplier, and Delay Launch | PASS |
| 6 | Constraints verified | Budget, time, capacity, restricted cases and hard-budget audit were executed successfully | PASS |
| 7 | Feasible option selected | Optimizer recommended Air Freight in the verified feasible scenario | PASS |
| 8 | Execute Decision | Frontend control exists but successful database-backed execution was not verified | BLOCKED |
| 9 | decision_log SELECT verified | No real database runtime or INSERT/SELECT evidence available | BLOCKED |
| 10 | Actual outcome submitted | No operational database outcome endpoint/runtime verified | BLOCKED |
| 11 | actual_outcomes SELECT verified | No real database-backed actual outcome evidence available | BLOCKED |
| 12 | Evaluation generated | Standalone `evaluate_decision()` was executed; 10/10 evaluation tests passed | PASS |
| 13 | ROI generated | No real evaluated database decision/outcome data was available; real ROI not verified | NOT VERIFIED |
| 14 | Positive outcome calculation verified | No real database-backed positive outcome evidence available | NOT VERIFIED |
| 15 | Discrepancy case tested | Predicted 500, actual 600 produced 16.666666666666664 percent discrepancy and `discrepancy_detected` | PASS |
| 16 | Retraining triggered | `trigger_retraining_if_needed()` returned `triggered=True` for the discrepancy case | PASS |
| 17 | New model verified | XGBoost retraining completed and temporary QA model was created successfully; cleanup completed | PASS |
| 18 | Decision history verified | No real database-backed decision history could be verified | BLOCKED |
| 19 | Frontend final flow verified | Frontend build passed, but live browser-to-FastAPI integration was blocked by CORS during QA | FAIL |

---

## Verified Prediction Evidence

Prediction target:

`delivery_time_deviation`

Predicted delay:

`5.330718994140625`

---

## Verified Optimization Evidence

Solver-generated alternatives:

`Air Freight`

`Secondary Supplier`

`Delay Launch`

Verified feasible scenario:

Budget = `700`

Allowed Time = `20`

Available Capacity = `100`

Shipment Capacity = `50`

All three alternatives were feasible in this specific scenario.

Recommended option:

`Air Freight`

---

## Constraint Evidence

Budget-restricted case:

Budget = `40`

Result:

`feasible_alternatives = []`

`recommended_option = None`

`status = no_feasible_solution`

Time-restricted case:

Allowed Time = `5`

Air Freight = feasible

Secondary Supplier = infeasible

Delay Launch = infeasible

Capacity-restricted case:

Available Capacity = `40`

Shipment Capacity = `50`

Result:

`feasible_alternatives = []`

`recommended_option = None`

---

## Week 3 Evaluation Evidence

10/10 standalone evaluation tests passed.

Exact match:

`within_expected_range`

Normal discrepancy:

`within_expected_range`

Threshold boundary:

`within_expected_range`

Above threshold:

`discrepancy_detected`

Missing actual:

`pending`

Zero-to-zero:

`within_expected_range`

Positive predicted cost with zero actual cost:

`discrepancy_detected`

Negative predicted cost:

`ValueError`

Negative actual cost:

`ValueError`

Empty decision ID:

`ValueError`

---

## Week 4 Retraining Evidence

Input:

Predicted cost = `500`

Actual cost = `600`

Discrepancy:

`16.666666666666664 percent`

Evaluation status:

`discrepancy_detected`

Retraining trigger:

`triggered=True`

Training rows:

`113097`

Training samples:

`90477`

Testing samples:

`22620`

MAE:

`3.420092708832049`

RMSE:

`3.8571221151353994`

R2:

`0.14264861146107266`

Temporary QA model:

`1356542 bytes`

Cleanup:

`completed`

---

## Database Verification

The repository contains `database/schema.sql` defining:

- supply_chain_data
- predictions
- prescriptive_recommendations
- decision_log
- actual_outcomes

However, the office PC did not have an available PostgreSQL client/service and Docker was not installed.

Therefore the following are NOT claimed as verified:

`DB INSERT`

`DB SELECT`

`decision_log` row verification

`actual_outcomes` row verification

real historical outcome integration

real outcome-based ROI

real decision history

---

## Frontend Verification

Frontend build:

PASS

Direct backend prediction:

PASS

Direct backend recommendation:

PASS

Live browser React-to-FastAPI integration:

FAIL due to CORS

Live backend-backed recommendation cards:

NOT VERIFIED

Live Cost display:

NOT VERIFIED

Live Speed/Time display:

NOT VERIFIED

Live Cost vs Speed display:

NOT VERIFIED

Execute Decision successful write-back:

NOT VERIFIED

---

## Final E2E Conclusion

The predictive, optimization, standalone evaluation, discrepancy detection, and standalone retraining components were successfully verified with actual execution evidence.

The complete production end-to-end workflow was NOT achieved.

The blocking dependencies are:

1. Operational PostgreSQL/Snowflake runtime
2. Real database INSERT/SELECT implementation
3. Decision write-back
4. Actual outcome persistence
5. Outcome-based evaluation and ROI
6. Production closed-loop learning
7. Live React-to-FastAPI integration

Therefore the final end-to-end acceptance status is:

`FAIL`

No unverified database, ROI, outcome, or production continuous-learning behavior is marked PASS.
---

## ROI Formula and Positive Outcome Definition

The following is the selected QA/business definition for this project. It is not presented as a company-provided formula because the PDF does not prescribe a specific ROI formula.

ROI = ((Predicted Cost - Actual Cost) / Predicted Cost) * 100

Positive outcome = Actual Cost < Predicted Cost

Interpretation:

- ROI > 0 percent means the actual cost was lower than the predicted cost.
- ROI = 0 percent means actual cost equals predicted cost.
- ROI < 0 percent means actual cost was higher than the predicted cost.

This formula is documented for evaluation purposes only.

No real ROI PASS is claimed because no production database-backed evaluated decision/outcome was available during final QA.
