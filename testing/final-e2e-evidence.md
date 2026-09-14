# Final E2E Evidence - Supply Prescript Project 3

## Scope

Target branch: final integrated `devops` branch.

Environment:
- React frontend
- FastAPI backend
- PostgreSQL database
- XGBoost prediction
- SciPy optimization

## 20-Point Evidence Matrix

| # | E2E Requirement | Evidence | Status |
|---|---|---|---|
| 1 | Real supply-chain record available | Record ID 1 used from live dataset | PASS |
| 2 | Prediction generated | Live `/recommend` returned `delivery_time_deviation` prediction | PASS |
| 3 | XGBoost prediction used | Backend prediction workflow loaded trained model | PASS |
| 4 | Optimization executed | Live optimization status returned `optimal` | PASS |
| 5 | Three alternatives generated | Air Freight, Secondary Supplier, Delay Launch | PASS |
| 6 | Budget feasibility shown | Budget validity returned for alternatives | PASS |
| 7 | Time feasibility shown | Time validity returned for alternatives | PASS |
| 8 | Capacity feasibility shown | Capacity validity returned for alternatives | PASS |
| 9 | Frontend displays backend data | Three live recommendation cards rendered | PASS |
| 10 | Analyst selects feasible recommendation | Air Freight selected | PASS |
| 11 | Infeasible recommendation cannot be selected | Frontend disables selection for infeasible recommendations | PASS |
| 12 | Decision execution succeeds | Browser returned Decision ID 50 | PASS |
| 13 | Decision persisted | Real PostgreSQL decision write-back test passed | PASS |
| 14 | Actual outcome captured | Actual cost 600, delay 6, completed | PASS |
| 15 | Predicted vs actual evaluated | Evaluation displayed predicted cost, actual cost and difference | PASS |
| 16 | Discrepancy status calculated | Evaluation returned `discrepancy_detected` | PASS |
| 17 | ROI calculated | Browser displayed approximately 12.38% ROI for the evaluated decision | PASS |
| 18 | History updated | Browser displayed stored decision history | PASS |
| 19 | ROI analytics updated | Browser displayed positive/negative counts, positive rate and average ROI | PASS |
| 20 | Continuous-learning trigger | Discrepancy evaluation returned retraining trigger metadata | PASS |

## Browser Workflow

`Record -> Generate -> Prediction -> 3 Alternatives -> Select Feasible Alternative -> Execute -> Decision ID -> Actual Outcome -> Evaluation -> ROI -> History -> ROI Analytics`

## Automated Evidence

- `pytest backend/tests -v` -> 12 passed, 2 skipped
- `RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v` -> 2 passed
- `npm.cmd --prefix frontend run lint` -> PASS
- `npm.cmd --prefix frontend run build` -> PASS
- `git diff --check` -> PASS


## Real Evaluation Snapshot

Decision ID: 50

Selected action: Air Freight

Predicted cost: approximately 684.76

Actual cost: 600

Absolute difference: approximately 84.76

Percentage difference: approximately 14.13%

Evaluation status: `discrepancy_detected`

ROI: approximately 12.38%

Outcome status: completed

## Evidence Integrity

All PASS entries above are based on actual execution evidence available during final QA. No fabricated database records, screenshots, performance values, or ROI values are asserted.
