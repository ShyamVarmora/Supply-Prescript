# Supply Prescript - Week 1 Progress

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Day 2 Verification Record

| Requirement | Status | Evidence |
|---|---|---|
| XGBoost baseline | PASS | Actual model load and reproducible XGBoost training metrics verified: 113097 rows, 90477 training samples, 22620 testing samples, MAE 3.420092708832049, RMSE 3.8571221151353994, R2 0.14264861146107266 |
| Shipment delay prediction | PASS | Real /recommend execution returned predicted_delay = 5.330718994140625 |
| React app scaffolding | PASS | npm run build completed successfully; 19 modules transformed and frontend loaded locally |
| Database connection | Historical — BLOCKED (02/09/2026) | PostgreSQL client/service and Docker were not available on the office PC; database schema exists but live connection was not verified |

## QA Note

These statuses are based on actual implementation and verification evidence.

No fabricated test results, model performance numbers, or PASS statuses are being added.

## Final Verification Update - 2026-09-14

Final integrated verification was performed against the current devops implementation.

- PostgreSQL verified with 5 required tables and live row counts.
- Prediction persisted in predictions for record 1.
- Three recommendations verified.
- Budget, time and capacity constraints verified.
- Decision 50 executed and persisted.
- Actual outcome 44 persisted for Decision 50.
- Evaluation returned discrepancy_detected and ROI 12.377519407267744%.
- ROI analytics returned 8 evaluated decisions, 5 positive outcomes, 3 negative outcomes, 62.5% positive rate, average ROI -0.30889857936569803%.
- Retraining timestamp persisted for Decision 50.
- Final model checksum and timestamp recorded in `testing/final-qa-matrix.md`.
- Browser closed-loop E2E completed successfully.

---

## Final integrated verification — 17/09/2026

Historical evidence above is retained for audit continuity. This section records the separate 17/09/2026 final-QA status; it predates the 19/09/2026 ROI analytics correction and is not the current-code result.

- Direct POST /predict/shipment-delay: HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.
- Backend automated tests: 12 passed, 2 skipped, 1 warning in 12.37s.
- Current local PostgreSQL integration rerun: BLOCKED because localhost:5432 is unavailable on this PC; latest run ended with KeyboardInterrupt after 34.96s and no PostgreSQL test passed.
- Frontend lint: PASS.
- Frontend build: PASS; 19 modules transformed.
- git diff --check: clean.
- Historical live-PostgreSQL evidence remains preserved in the document above.
