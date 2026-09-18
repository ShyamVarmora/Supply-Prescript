# Final Project 3 E2E Evidence

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Verified integrated E2E run — 12/09/2026

> The 20-point matrix below is the successful integrated E2E verification from 12/09/2026. The later 17/09/2026 PostgreSQL result is a separate QA-machine environment rerun.

## 1. Database Connection
Actual result: PASS
Evidence: `psycopg.connect` succeeded against the PostgreSQL `supply_prescript_db` instance, and the live DB query returned the required tables and counts.

## 2. Real Dataset
Actual result: PASS
Evidence: `SELECT record_id ... FROM supply_chain_data WHERE record_id IN (1, 2)` returned real row data for record_id 1 and 2, including `warehouse_inventory_level` and `shipping_costs` values.

## 3. Record Selection
Actual result: PASS
Evidence: record_id 1 was selected as a valid real shipment record for the live recommendation workflow.

## 4. Prediction
Actual result: PASS
Evidence: `/recommend` for record_id 1 returned `prediction.target = "delivery_time_deviation"` and `predicted_delay = 5.67630672454834`.

## 5. Prediction Persistence
Actual result: PASS
Evidence: the real PostgreSQL workflow verified that the `/recommend` prediction was persisted in the `predictions` table with target `delivery_time_deviation`.

## 6. Three Recommendations
Actual result: PASS
Evidence: `/recommend` returned three alternatives: Air Freight, Secondary Supplier, and Delay Launch.

## 7. Budget Constraint
Actual result: PASS
Evidence: the optimizer returned per-alternative budgets and all three alternatives reported `budget_valid = True` under the verified scenario.

## 8. Time Constraint
Actual result: PASS
Evidence: `time_valid` values returned for the live recommendation set were `True`; no time failure occurred in the verified scenario.

## 9. Capacity Constraint
Actual result: PASS
Evidence: `capacity_valid` values returned `True` for the live recommendation set in the verified scenario.

## 10. Feasible Recommendation
Actual result: PASS
Evidence: the recommendation payload included `all_constraints_satisfied = True` and `feasibility = "feasible"` on all three generated alternatives under the validated scenario.

## 11. Execute Decision
Actual result: PASS
Evidence: a live `POST /decisions` request succeeded and returned a decision_id for the selected recommendation.

## 12. decision_log INSERT
Actual result: PASS
Evidence: the selected recommendation was inserted into `decision_log`; the live DB output showed a row with `decision_id`, `record_id`, `recommendation_id`, `selected_action`, and `decision_status = "SELECTED"`.

## 13. Actual Outcome
Actual result: PASS
Evidence: the real PostgreSQL workflow inserted an actual outcome for the temporary selected decision with completed status; the test cleaned up the temporary record afterward.

## 14. actual_outcomes INSERT
Actual result: PASS
Evidence: the real PostgreSQL workflow verified an inserted row in `actual_outcomes` before cleanup.

## 15. Evaluation
Actual result: PASS
Evidence: `GET /decisions/{decision_id}/evaluation` returned an evaluation for the temporary real-DB decision.

## 16. ROI
Actual result: PASS
Evidence: the evaluation and ROI payload returned a calculated ROI from the recorded actual outcome; no volatile percentage is copied into this static evidence document.

## 17. History
Actual result: PASS
Evidence: `GET /decisions/history` returned the stored decision list with evaluation data attached for the selected record.

## 18. ROI Analytics
Actual result: PASS
Evidence: `GET /decisions/analytics/roi` returned computed analytics during the verified workflow; aggregate values are runtime data and are not presented as fixed repository facts.

## 19. Discrepancy and Retraining
Actual result: PASS
Evidence: the real DB integration test executed a discrepancy case by setting actual cost to 1.2x the selected cost; the evaluation returned `status = "discrepancy_detected"`, `triggered = True`, and retraining metadata included model path, checksums, metrics, and timestamps.

## 20. Final Automated Tests
Actual result: PASS
Evidence:
- 12/09/2026 integrated verification: `pytest backend/tests -v` → 14 passed, 0 failed, 0 skipped, 1 warning
- 12/09/2026 integrated verification: `$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v` → 2 passed, 0 failed, 1 warning
- `npm --prefix frontend run lint` → passed
- `npm --prefix frontend run build` → passed
- `git diff --check` → clean

## Evidence Integrity

All PASS entries in the 12/09/2026 integrated matrix are based on actual execution evidence. No fabricated database records, screenshots, performance values, or ROI values are asserted.

The 12/09/2026 run is the verified functional baseline for the implementation in this PR. Documentation-only cleanup followed; no backend/frontend feature or database architecture changes were introduced afterward. Retraining is described as discrepancy-triggered XGBoost retraining; no production continuous-learning deployment is claimed.

---

## QA-machine rerun — 17/09/2026

Direct POST /predict/shipment-delay: HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.

Backend: pytest backend/tests -v -W always → 12 passed, 2 skipped, 1 warning in 12.37s.
Real PostgreSQL rerun: BLOCKED; psycopg.connect() could not reach localhost:5432 and the run was interrupted after 34.96s.
Frontend lint: PASS. Frontend build: PASS; 19 modules transformed. git diff --check: clean.

The 17/09/2026 PostgreSQL result is an environment-only blocked rerun. The successful 12/09/2026 integrated PostgreSQL verification remains the functional evidence baseline and is preserved above; no current 2 passed PostgreSQL result is claimed.

---

## Explicit final-QA evidence — 17/09/2026

### Direct POST /predict/shipment-delay — current local evidence

Request: `POST /predict/shipment-delay`

Actual response: `HTTP 200`

```json
{"prediction_target":"delivery_time_deviation","predicted_delivery_time_deviation":5.67630672454834}
```

### SQL SELECT — predictions — historical live-PostgreSQL evidence

```sql
SELECT record_id, prediction_target, predicted_value
FROM predictions
WHERE record_id = 1
  AND prediction_target = 'delivery_time_deviation';
```

Returned historical row: `record_id=1 | prediction_target=delivery_time_deviation | predicted_value=6.1492509841918945`

### SQL SELECT — prescriptive_recommendations — historical live-PostgreSQL evidence

```sql
SELECT recommendation_id, record_id, action
FROM prescriptive_recommendations
WHERE recommendation_id = 109;
```

Returned historical row: `recommendation_id=109 | record_id=1 | action=Air Freight`

### SQL SELECT — decision_log — historical live-PostgreSQL evidence

```sql
SELECT decision_id, record_id, recommendation_id,
       selected_action, decision_status
FROM decision_log
WHERE decision_id = 50;
```

Returned historical row: `decision_id=50 | record_id=1 | recommendation_id=109 | selected_action=Air Freight | decision_status=SELECTED`

### SQL SELECT — actual_outcomes — historical live-PostgreSQL evidence

```sql
SELECT outcome_id, decision_id,
       actual_cost, actual_delay_days, outcome_status
FROM actual_outcomes
WHERE decision_id = 50;
```

Returned historical row: `outcome_id=44 | decision_id=50 | actual_cost=600 | actual_delay_days=6 | outcome_status=completed`

### Constraint failures

Budget failure → `budget_valid=False`, `feasibility=infeasible`.
Time failure → `time_valid=False`, `feasibility=infeasible`.
Capacity failure → `capacity_valid=False`, `feasibility=infeasible`.

### Decision validation — historical integration coverage

Invalid record → HTTP `404`.
Invalid recommendation → HTTP `404`.
Wrong record/recommendation pairing → HTTP `404`.
Wrong action → HTTP `422`.
Infeasible recommendation selection → HTTP `422`.

### Evaluation — historical integration coverage

Pending → `pending`.
Exact-cost → `within_expected_range`.
Discrepant cost → `discrepancy_detected`.

### Retraining — historical integration coverage

Retraining result asserted `mae`, `rmse`, `r2`, `previous_checksum`, `new_checksum`, `training_rows`, `test_rows`, and `training_timestamp`.

Historical model checksum: `DBF30350C08ABA3958219B76C552C8BA847FC7B5534E5E75B4AD468A11BB2F2B`

Historical model size: `1372358 bytes`

Historical model timestamp: `2026-09-14 23:33:28`

Exact numeric MAE/RMSE/R2 values are not captured in static repository evidence and are not asserted.

### Current automated verification

`pytest backend/tests -v -W always` → `12 passed, 2 skipped, 1 warning in 12.37s`.

Exact warning: `DeprecationWarning: The anyio.abc.BlockingPortal alias is deprecated, use anyio.from_thread.BlockingPortal instead.`

Current real-PostgreSQL rerun: `2 tests collected; first test reached the PostgreSQL connection and the run ended with KeyboardInterrupt after 34.96s; no PostgreSQL test passed.`
