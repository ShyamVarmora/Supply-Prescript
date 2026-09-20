# Supply Prescript - Final QA Matrix

## Current verified release status — 2026-09-20

Current verification on the devops branch is as follows:

- Backend: `python -W error -m pytest -v` → 15 passed, 0 skipped, 0 warnings
- Real PostgreSQL: `RUN_REAL_DB=1 python -W error -m pytest -v` → 2 real DB tests passed, 0 skipped, 0 warnings
- Frontend: `npm run lint` and `npm run build` → passed
- Dependency check: `python -m pip check` → passed
- Repository hygiene: `git diff --check` → passed

Historical dated QA sections remain preserved below for audit continuity only; the active verification status above reflects the current code.

## Historical snapshot — 02/09/2026

> Historical snapshot only: all results in the table above reflect the 02/09/2026 state. The verified integrated acceptance matrix below is dated 12/09/2026; the 17/09/2026 section records a separate environment rerun.

## Verified integrated status — 12/09/2026

> The PASS statuses below are historical evidence from the successful integrated PostgreSQL/browser verification performed on 12/09/2026. The 17/09/2026 QA-machine rerun was separate and BLOCKED because PostgreSQL was unavailable. The 19/09/2026 ROI analytics semantic correction and matching unit test require current-code verification, which is reported separately below.

## Scope

This matrix records the implementation and actual execution evidence from the successful 12/09/2026 integrated verification.

PASS is used only where the documented implementation and execution evidence support the requirement.

Test-result context: GitHub Actions uses `pytest -q` and reported 12 passed, 2 skipped, 1 warning. The 12/09/2026 local full verification used `$env:RUN_REAL_DB="1"; pytest backend/tests -v` and reported 14 passed, 0 failed, 0 skipped, 1 warning. The dedicated real-PostgreSQL suite used `$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v` and reported 2 passed, 0 failed, 1 warning.

| Requirement | Test | Expected | Actual | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| XGBoost predictive baseline | Load `backend/ml/predict.py` and execute prediction workflow | Model loads and returns a prediction | Live API returned a forecast | 12/09/2026 integrated verification | PASS |
| Historical dataset | Query live `supply_chain_data` | Real shipment records are available | record_id 1 and 2 returned | 12/09/2026 PostgreSQL verification | PASS |
| PostgreSQL database | `$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v` | Tests connect to live PostgreSQL and complete | 2 passed, 0 failed, 1 warning | 12/09/2026 integrated verification | PASS |
| Prediction persistence | Run `/recommend` and verify `predictions` persistence | Prediction row is stored | Record 1 prediction persisted with target `delivery_time_deviation` | 12/09/2026 live PostgreSQL workflow | PASS |
| Three recommendations | Call `/recommend` for the verified record | Three alternatives are returned | Air Freight, Secondary Supplier, Delay Launch returned | 12/09/2026 integrated workflow | PASS |
| Budget constraint | Run optimizer budget tests including failure case | Budget-invalid actions are infeasible | Budget-failure scenarios passed | 12/09/2026 automated verification | PASS |
| Time constraint | Run optimizer time tests including failure case | Time-invalid actions are infeasible | Time-failure scenarios passed | 12/09/2026 automated verification | PASS |
| Capacity constraint | Run optimizer capacity tests including failure case | Capacity-invalid actions are infeasible | Capacity-failure scenarios passed | 12/09/2026 automated verification | PASS |
| Execute Decision | POST `/decisions` with a feasible recommendation | Decision is accepted and assigned an ID | Live decision was created and persisted | 12/09/2026 real PostgreSQL verification | PASS |
| Decision DB write-back | SELECT the selected decision from `decision_log` | Decision row matches the selected recommendation | Decision write-back was validated | 12/09/2026 live PostgreSQL workflow | PASS |
| Actual outcome DB write-back | POST `/decisions/{id}/outcome` and verify `actual_outcomes` | Outcome is persisted | Actual outcome row was inserted and returned | 12/09/2026 live PostgreSQL workflow | PASS |
| Evaluation | GET `/decisions/{id}/evaluation` | Evaluation returns actual-vs-predicted comparison | Evaluation returned status and difference | 12/09/2026 live workflow | PASS |
| Discrepancy | Evaluate a discrepant actual cost | Discrepancy is detected | `discrepancy_detected` returned with retraining metadata | 12/09/2026 real PostgreSQL workflow | PASS |
| Decision ROI | Evaluate a stored decision and request ROI | ROI is calculated from evaluated data | ROI returned by evaluation/analytics endpoints | 12/09/2026 live workflow | PASS |
| Decision history | GET `/decisions/history` | Stored decisions are retrievable | History returned prior decisions and evaluation summaries | 12/09/2026 live workflow | PASS |
| ROI analytics | GET `/decisions/analytics/roi` | Aggregate ROI analytics are returned | Computed ROI analytics returned | 12/09/2026 live workflow | PASS |
| Retraining | Run discrepancy-triggered retraining workflow | Retraining is triggered for discrepancy | Retraining path executed in the real DB workflow | 12/09/2026 retraining verification | PASS |
| Frontend lint | `npm --prefix frontend run lint` | No lint errors | Passed | 12/09/2026 frontend verification | PASS |
| Frontend build | `npm --prefix frontend run build` | Production build succeeds | Passed | 12/09/2026 frontend verification | PASS |
| GitHub Actions backend CI | `pytest -q` in GitHub Actions | CI backend suite completes | 12 passed, 2 skipped, 1 warning | GitHub Actions CI | PASS |
| Local full backend verification | `$env:RUN_REAL_DB="1"; pytest backend/tests -v` | Full local suite completes without failures | 14 passed, 0 failed, 0 skipped, 1 warning | 12/09/2026 local full verification | PASS |
| Git hygiene | `git diff --check` | No whitespace errors | No output | 12/09/2026 repository verification | PASS |
## Live Evidence Snapshot

The actual DB and API evidence captured during the final verification run showed:

- record_id 1 was a valid real record in `supply_chain_data`
- `/recommend` returned a model-generated `delivery_time_deviation` prediction
- all three alternatives were feasible under selected constraints and had `all_constraints_satisfied = True`
- selected decision inserted into `decision_log` and the `actual_outcomes` row was recorded successfully
- ROI and history endpoints responded with real data during the verified workflow
- a discrepancy-triggered retraining path was verified in the live DB test

## Final Conclusion

The 12/09/2026 integrated verification established the historical functional baseline for the closed-loop workflow. The 19/09/2026 ROI analytics correction changed backend behavior and added a matching test, so the current-code results must not be represented as part of the 12/09/2026 evidence.

## Current-code audit — 19/09/2026

The ROI analytics semantic correction and matching unit test were added on 19/09/2026. Current automated backend, fresh real-PostgreSQL, frontend lint/build, and diff checks are reported by the final release audit; they are separate from the historical 12/09/2026 evidence.

---

## QA-machine rerun — 17/09/2026

The historical snapshot above is retained for audit continuity. The table below records the 17/09/2026 QA-machine rerun separately from the successful 12/09/2026 integrated verification. BLOCKED here is an environment result, not a replacement for the verified functional run.

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
| Predictions SQL evidence | SQL SELECT from predictions for record_id=1 | Matching persisted prediction row | Historical row: record_id=1, prediction_target=delivery_time_deviation, predicted_value=6.1492509841918945 | Historical PostgreSQL SQL evidence | PASS — Historical |
| Recommendation SQL evidence | SQL SELECT from prescriptive_recommendations for recommendation_id=109 | Matching persisted recommendation row | Historical row: recommendation_id=109, record_id=1, action=Air Freight | Historical PostgreSQL SQL evidence | PASS — Historical |
| decision_log SQL evidence | SQL SELECT decision_log for decision_id=50 | Matching decision row | Historical row: Decision 50, record 1, recommendation 109, Air Freight, SELECTED | Historical PostgreSQL SQL evidence | PASS — Historical |
| actual_outcomes SQL evidence | SQL SELECT actual_outcomes for decision_id=50 | Matching outcome row | Historical row: Outcome 44, decision 50, actual_cost=600, actual_delay_days=6, completed | Historical PostgreSQL SQL evidence | PASS — Historical |
| Invalid record rejection | POST /decisions with unknown record | HTTP 404 | Historical integration test asserted HTTP 404 | Historical real-PostgreSQL integration test | PASS — Historical |
| Invalid recommendation rejection | POST /decisions with unknown recommendation | HTTP 404 | Historical integration test asserted HTTP 404 | Historical real-PostgreSQL integration test | PASS — Historical |
| Wrong record/recommendation rejection | POST /decisions with mismatched record and recommendation | HTTP 404 | Historical integration test asserted HTTP 404 | Historical real-PostgreSQL integration test | PASS — Historical |
| Wrong action rejection | POST /decisions with unapproved action | HTTP 422 | Historical integration test asserted HTTP 422 | Historical real-PostgreSQL integration test | PASS — Historical |
| Infeasible action rejection | POST /decisions with infeasible recommendation | HTTP 422 | Historical integration test asserted HTTP 422 | Historical real-PostgreSQL integration test | PASS — Historical |
| Model checksum | Historical retraining artifact verification | SHA-256 recorded | DBF30350C08ABA3958219B76C552C8BA847FC7B5534E5E75B4AD468A11BB2F2B | Historical model evidence | PASS — Historical |
| Model timestamp | Historical retraining artifact verification | Timestamp recorded | 2026-09-14 23:33:28; size 1372358 bytes | Historical model evidence | PASS — Historical |
| Retraining metrics | Historical retraining assertion | MAE/RMSE/R2 fields present | Historical integration test asserted mae, rmse, r2, checksums, training/test rows and timestamp; exact numeric metrics not captured | Historical real-PostgreSQL integration test | PASS — Historical |
| Test warning | pytest backend/tests -v -W always | Warning identified | Starlette `BlockingPortal` deprecation warning | Current local test output | WARNING |
| PostgreSQL integration suite | RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v -W always | Two tests execute against PostgreSQL | Current PC could not connect to localhost:5432; run interrupted after 34.96s | Current test output + connectivity check | BLOCKED |
| Backend automated suite | pytest backend/tests -v -W always | No failed tests | 12 passed, 2 skipped, 1 warning in 12.37s | Final-QA local run | PASS |
| Frontend lint | npm.cmd --prefix frontend run lint | No ESLint errors | Passed | Final-QA local run | PASS |
| Frontend build | npm.cmd --prefix frontend run build | Production build succeeds | Passed; 19 modules transformed | Final-QA local run | PASS |
| Repository hygiene | git diff --check | No whitespace errors | Clean; no output | Final-QA local run | PASS |
