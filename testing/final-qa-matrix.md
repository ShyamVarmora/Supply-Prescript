# Supply Prescript - Final QA Matrix

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Scope

This matrix reflects the verified current devops implementation and the actual execution evidence captured during final QA.

PASS is used only where implementation and execution evidence exist in the current repository state.

| Requirement | Actual Evidence | Status |
| --- | --- | --- |
| XGBoost predictive baseline | `backend/ml/predict.py` loads `models/shipment_delay_model.joblib`; live API returned a forecast | PASS |
| Historical dataset | PostgreSQL `supply_chain_data` was queried successfully and returned record_id 1 and 2 | PASS |
| PostgreSQL database | Real DB tests passed with live PostgreSQL connections; required tables were present | PASS |
| Prediction persistence | `predictions` table recorded values for record_id 1; prediction_target was `delivery_time_deviation` | PASS |
| Three recommendations | `/recommend` returned three alternatives: Air Freight, Secondary Supplier, Delay Launch | PASS |
| Budget constraint | Optimizer tests covered budget-failure scenarios and passed | PASS |
| Time constraint | Optimizer tests covered time-failure scenarios and passed | PASS |
| Capacity constraint | Optimizer tests covered capacity-failure scenarios and passed | PASS |
| Execute Decision | Real DB test created a selected decision and returned a decision_id | PASS |
| Decision DB write-back | `decision_log` row was inserted and validated against the selected recommendation | PASS |
| Actual outcome DB write-back | `actual_outcomes` row was inserted and returned by the API | PASS |
| Evaluation | `GET /decisions/{decision_id}/evaluation` returned status and the actual difference against prediction | PASS |
| Discrepancy | Real discrepancy case triggered `discrepancy_detected` and retraining metadata | PASS |
| Decision ROI | ROI values are returned by `GET /decisions/analytics/roi` and the evaluation payload | PASS |
| Decision history | `GET /decisions/history` returned prior decisions and evaluation summaries | PASS |
| ROI analytics | ROI analytics endpoint returned computed metrics during the verified workflow; aggregate values remain runtime data | PASS |
| Retraining | discrepancy-triggered retraining path was executed in the real DB workflow | PASS |
| Frontend lint | `npm --prefix frontend run lint` passed | PASS |
| Frontend build | `npm --prefix frontend run build` passed | PASS |
| Backend tests | `pytest backend/tests -v` returned 14 passed, 0 failed, 0 skipped, 1 warning | PASS |
| Real PostgreSQL tests | `$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v` returned 2 passed, 0 failed, 1 warning | PASS |
| Git hygiene | `git diff --check` returned no output | PASS |

## Live Evidence Snapshot

The actual DB and API evidence captured during the final verification run showed:

- record_id 1 was a valid real record in `supply_chain_data`
- `/recommend` returned a model-generated `delivery_time_deviation` prediction
- all three alternatives were feasible under selected constraints and had `all_constraints_satisfied = True`
- selected decision inserted into `decision_log` and the `actual_outcomes` row was recorded successfully
- ROI and history endpoints responded with real data during the verified workflow
- a discrepancy-triggered retraining path was verified in the live DB test

## Final Conclusion

The current devops implementation is verified for the implemented closed-loop workflow and does not rely on stale or fabricated evidence.

---

## Final integrated verification — 17/09/2026

The historical snapshot above is retained for audit continuity. The following table records the latest final-QA verification and separates current local evidence from historical live-PostgreSQL evidence.

| Requirement | Test | Expected | Actual | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| Direct shipment-delay prediction | POST /predict/shipment-delay with real record-1 feature values | HTTP 200 with prediction result | HTTP 200; prediction_target=delivery_time_deviation; predicted_delivery_time_deviation=5.67630672454834 | Final-QA local FastAPI response | PASS |
| Budget constraint | Optimizer budget-failure test | Budget-invalid action is infeasible | Passing backend test | backend/tests/test_workflows.py | PASS |
| Time constraint | Optimizer time-failure test | Time-invalid action is infeasible | Passing backend test | backend/tests/test_workflows.py | PASS |
| Capacity constraint | Optimizer capacity-failure test | Capacity-invalid action is infeasible | Passing backend test | backend/tests/test_workflows.py | PASS |
| Three recommendations | Recommendation workflow | Three alternatives returned | Historical live-PostgreSQL evidence recorded three alternatives | Historical final E2E evidence | PASS — Historical |
| Execute Decision | POST /decisions with feasible recommendation | decision_id returned and DB INSERT | Historical Decision 50 was returned and persisted | Historical SQL evidence | PASS — Historical |
| decision_log | SELECT decision_id, record_id, recommendation_id, selected_action, decision_status WHERE decision_id=50 | Matching decision row returned | Historical row: Decision 50, record 1, recommendation 109, Air Freight, SELECTED | Historical SQL evidence | PASS - Historical |
| Actual outcome | POST /decisions/{decision_id}/outcome | Outcome persisted | Historical Outcome 44 persisted with cost 600 and delay 6 | Historical SQL evidence | PASS - Historical |
| actual_outcomes | SELECT outcome_id, decision_id, actual_cost, actual_delay_days, outcome_status WHERE decision_id=50 | Matching outcome row returned | Historical row: Outcome 44, Decision 50, 600, 6, completed | Historical SQL evidence | PASS - Historical |
| Pending evaluation | Evaluation before actual outcome | Status pending | Passing backend evaluation test | backend/tests/test_workflows.py | PASS |
| Within-threshold evaluation | Exact-match evaluation | Status within_expected_range | Passing integration coverage retained in historical evidence | Historical real-DB test | PASS - Historical |
| Discrepancy evaluation | Evaluation with discrepancy | Status discrepancy_detected | Passing backend test; historical Decision 50 discrepancy evidence retained | Backend tests + historical evidence | PASS |
| Retraining | Retraining trigger test | Trigger only for discrepancy | Passing backend test | backend/tests/test_workflows.py | PASS |
| Predictions persistence | SQL verification of predictions | Persisted prediction row exists | Historical record-1 prediction persistence was verified | Historical PostgreSQL evidence | PASS - Historical |
| Recommendation persistence | SQL verification of prescriptive_recommendations | Three recommendation rows exist | Historical three recommendation rows were verified | Historical PostgreSQL evidence | PASS - Historical |
| PostgreSQL integration suite | RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v -W always | Two tests execute against PostgreSQL | Current PC could not connect to localhost:5432; run interrupted after 212.42s | Current test output + connectivity check | BLOCKED |
| Backend automated suite | pytest backend/tests -v -W always | No failed tests | 12 passed, 2 skipped, 1 warning in 2.85s | Final-QA local run | PASS |
| Frontend lint | npm.cmd --prefix frontend run lint | No ESLint errors | Passed | Final-QA local run | PASS |
| Frontend build | npm.cmd --prefix frontend run build | Production build succeeds | Passed; 19 modules transformed | Final-QA local run | PASS |
| Repository hygiene | git diff --check | No whitespace errors | Clean; no output | Final-QA local run | PASS |
