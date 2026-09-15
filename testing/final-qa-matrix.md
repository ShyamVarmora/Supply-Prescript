# Supply Prescript - Final QA Matrix

## Scope

Final QA target: integrated `devops` implementation with documentation synchronized from final verification.

PASS is used only where actual implementation and execution evidence exists.

| Requirement | Actual Evidence | Status |
|---|---|---|
| XGBoost predictive baseline | Real training/evaluation evidence recorded; model artifact exists in final devops worktree | PASS |
| Historical dataset | `supply_chain_data` contains 113097 rows | PASS |
| PostgreSQL database | PostgreSQL operational; 5 required tables verified | PASS |
| Prediction persistence | `predictions` row verified for record 1; prediction target `delivery_time_deviation`, persisted value `6.1492509841918945` | PASS |
| Three recommendations | Final recommendation workflow generated Air Freight, Secondary Supplier, Delay Launch | PASS |
| Budget constraint | Optimizer constraint tests and live feasible/infeasible scenarios verified | PASS |
| Time constraint | Optimizer time-failure scenario verified | PASS |
| Capacity constraint | Optimizer capacity-failure scenario verified | PASS |
| Execute Decision | Browser executed selected Air Freight recommendation; Decision ID 50 | PASS |
| Decision DB write-back | `decision_log` row verified for Decision 50 | PASS |
| Actual outcome DB write-back | `actual_outcomes` row 44 verified for Decision 50 | PASS |
| Evaluation | Decision 50: discrepancy_detected; predicted 684.7557795, actual 600 | PASS |
| Discrepancy | 14.12596325% difference against 10% threshold | PASS |
| Decision ROI | Decision 50 ROI = 12.377519407267744% | PASS |
| Decision history | `GET /decisions/history` returned stored decisions and evaluation data | PASS |
| ROI analytics | 8 evaluated decisions; 5 positive, 3 negative; positive rate 62.5%; average ROI -0.30889857936569803% | PASS |
| Retraining | Decision 50 has `retraining_triggered_at = 2026-09-14 23:30:59.769236+05:30` in `decision_log` | PASS |
| New model artifact | SHA-256 `DBF30350C08ABA3958219B76C552C8BA847FC7B5534E5E75B4AD468A11BB2F2B`; size 1372358 bytes; timestamp 2026-09-14 23:33:28 | PASS |
| Browser E2E | Record -> Generate -> Prediction -> 3 alternatives -> Select -> Execute -> Outcome -> Evaluation -> ROI -> History -> ROI Analytics completed | PASS |
| Frontend lint | `npm.cmd --prefix frontend run lint` passed | PASS |
| Frontend build | Vite build passed; 19 modules transformed | PASS |
| Backend automated tests | `pytest backend/tests -v`: 12 passed, 2 skipped, 1 warning | PASS |
| Real PostgreSQL tests | `RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v`: 2 passed, 1 warning | PASS |
| Git whitespace | `git diff --check` clean | PASS |


## PostgreSQL Row Counts

| Table | Rows |
|---|---:|
| supply_chain_data | 113097 |
| predictions | 7 |
| prescriptive_recommendations | 60 |
| decision_log | 14 |
| actual_outcomes | 8 |

## Decision 50 SQL Evidence

`decision_id = 50`

`record_id = 1`

`recommendation_id = 109`

`selected_action = Air Freight`

`expected_cost = 684.7557795`

`decision_status = SELECTED`

`retraining_triggered_at = 2026-09-14 23:30:59.769236+05:30`

## Actual Outcome SQL Evidence

`outcome_id = 44`

`decision_id = 50`

`actual_cost = 600`

`actual_delay_days = 6`

`outcome_status = completed`

## Evaluation Evidence

Predicted cost: `684.7557795`

Actual cost: `600`

Absolute difference: `84.75577950000002`

Percentage difference: `14.125963250000003`

Threshold: `10.0%`

Status: `discrepancy_detected`

ROI: `12.377519407267744%`

## ROI Analytics Evidence

Positive outcome definition: `actual_cost <= expected_cost`

Total decisions: `8`

Evaluated decisions: `8`

Positive outcomes: `5`

Negative outcomes: `3`

Positive outcome rate: `62.5%`

Average ROI: `-0.30889857936569803%`

## Model Evidence

SHA-256:
`DBF30350C08ABA3958219B76C552C8BA847FC7B5534E5E75B4AD468A11BB2F2B`

Size:
`1372358 bytes`

LastWriteTime:
`2026-09-14 23:33:28`

## Final Conclusion

The final integrated workflow has actual backend, PostgreSQL, frontend, browser E2E, evaluation, ROI, and retraining evidence.
