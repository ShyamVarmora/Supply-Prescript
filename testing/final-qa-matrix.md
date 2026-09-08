# Supply Prescript - Final QA Matrix

| Requirement | Implementation | Test | Actual Result | Status |
|---|---|---|---|---|
| XGBoost predictive baseline | backend/ml/train.py | Real XGBoost training | 113097 rows; MAE 3.420092708832049; RMSE 3.8571221151353994; R2 0.14264861146107266 | PASS |
| Historical supply-chain data | data/raw/dynamic_supply_chain_logistics_dataset_with_country.csv | Real dataset load | 113097 rows and 18 columns | PASS |
| Shipment-delay prediction | backend/ml/predict.py and /recommend | Real API execution | predicted_delay = 5.330718994140625 | PASS |
| React application scaffolding | frontend/ React/Vite | npm run build | Build successful; 19 modules transformed | PASS |
| PostgreSQL / Snowflake connection | No verified operational implementation | Connection test | No successful operational connection verified | NOT STARTED |
| Budget constraint | backend/ml/optimizer.py | Budget 700 and budget 40 tests | Constraints enforced; budget 40 produced no feasible solution | PASS |
| Time constraint | backend/ml/optimizer.py | Allowed time 5 | Air Freight feasible; other two infeasible | PASS |
| Capacity constraint | backend/ml/optimizer.py | Available capacity 40 | No feasible solution | PASS |
| SciPy optimization | scipy.optimize.linprog | Real optimizer execution | Valid recommendation returned | PASS |
| Three solver-generated alternatives | backend/ml/optimizer.py | Alternative count test | Air Freight, Secondary Supplier, Delay Launch = 3 | PASS |
| Three feasible alternatives in one scenario | optimizer API | Budget 700 / Time 20 / Capacity 100 | All three alternatives feasible | PASS |
| Three prescription cards | frontend/src/App.jsx | Frontend and browser test | Card structure exists; live backend request blocked by CORS | IN PROGRESS |
| Cost display | frontend/src/App.jsx | Backend and browser verification | Backend costs verified; live rendering not verified | IN PROGRESS |
| Speed / time display | frontend/src/App.jsx | Backend and browser verification | Backend times verified; live rendering not verified | IN PROGRESS |
| Cost vs Speed trade-off | Backend optimizer + frontend | Cost/time verification | Backend pairs verified; live frontend comparison not verified | IN PROGRESS |
| Hard budget proof | backend/ml/optimizer.py | Budget audit | Returned recommendation costs did not exceed budget | PASS |
| Execute Decision | frontend/src/App.jsx | End-to-end execution | UI exists; DB-backed execution not verified | IN PROGRESS |
| Real database INSERT | database/ | INSERT + SELECT | No real INSERT/SELECT evidence | BLOCKED |
| Negative write-back tests | database/ | Negative validation tests | Not executed | NOT STARTED |
| Predicted vs actual evaluation | backend/ml/evaluate.py | 10 standalone tests | All 10 tests passed | PASS |
| Missing actual outcome | backend/ml/evaluate.py | actual_cost = None | Status returned pending | PASS |
| Actual historical outcome | Database outcome source | actual_outcomes verification | No verified DB-backed outcomes | NOT STARTED |
| Operational closed loop | evaluation + DB | Decision-to-outcome workflow | Not executed operationally | IN PROGRESS |
| Decision ROI | ROI workflow | Real evaluated decisions | No verified real outcome-based ROI | IN PROGRESS |
| Positive outcomes | Outcome workflow | Actual outcome records | No verified positive outcomes | NOT STARTED |
| Feedback / evaluation UI | frontend | UI verification | Structure exists; real evaluation data unavailable | IN PROGRESS |
| Discrepancy detection | backend/ml/evaluate.py | Predicted 500 / actual 600 | 16.666666666666664 percent; discrepancy_detected | PASS |
| Retraining trigger | trigger_retraining_if_needed() | Discrepancy case | triggered=True | PASS |
| XGBoost retraining workflow | retrain_model() | Actual retraining | Training completed; temporary QA model created | PASS |
| Production continuous learning | DB-driven workflow | Full production workflow | Not verified | IN PROGRESS |
| Final end-to-end workflow | Prediction -> recommendation -> decision -> DB -> outcome -> evaluation -> ROI -> retraining | End-to-end test | Frontend/DB/outcome links incomplete | FAIL |

## Final QA Conclusion

The predictive baseline, optimizer, standalone evaluation, discrepancy detection and standalone retraining workflow were verified with actual execution evidence.

The complete production end-to-end workflow is NOT verified. Remaining gaps include live React-to-FastAPI integration, operational database connectivity/write-back, actual outcome capture, ROI from real outcomes, and production continuous learning.

No unverified requirement is marked PASS.
