# Final Project 3 E2E Evidence

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

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
- `pytest backend/tests -v` → 14 passed, 0 failed, 0 skipped, 1 warning
- `$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v` → 2 passed, 0 failed, 1 warning
- `npm --prefix frontend run lint` → passed
- `npm --prefix frontend run build` → passed
- `git diff --check` → clean

## Evidence Integrity

All PASS entries above are based on actual execution evidence available during final QA. No fabricated database records, screenshots, performance values, or ROI values are asserted.

This evidence reflects the current devops implementation only. Retraining is described as discrepancy-triggered XGBoost retraining; no production continuous-learning deployment is claimed.

---

## Final integrated verification — 17/09/2026

Direct POST /predict/shipment-delay: HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.

Backend: pytest backend/tests -v -W always → 12 passed, 2 skipped, 1 warning in 2.85s.
Real PostgreSQL rerun: BLOCKED; psycopg.connect() could not reach localhost:5432 and the run was interrupted after 212.42s.
Frontend lint: PASS. Frontend build: PASS; 19 modules transformed. git diff --check: clean.

Historical live-PostgreSQL evidence remains preserved above; no current 2 passed PostgreSQL result is claimed.
