# Supply Prescript - Final QA Matrix

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
