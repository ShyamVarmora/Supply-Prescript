# Supply Prescript — Week 1 QA Test Plan

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Purpose

This document defines the QA checks for the Week 1 implementation of Supply Prescript.

These checks are derived from the Week 1 project requirements.

No test is marked as PASS until supporting implementation evidence is available.

---

## 1. Predictive Model

### Historical Mock Supply-Chain Data

- [ ] Historical mock supply-chain data loads correctly.
- [ ] Required input data is available.
- [ ] Data can be consumed by the predictive model.

### XGBoost Training

- [ ] XGBoost training completes successfully.
- [ ] Training uses the historical mock supply-chain data.
- [ ] Training output is generated successfully.

### Shipment-Delay Prediction

- [ ] Shipment-delay prediction is produced.
- [ ] Prediction output is available for the expected input.
- [ ] Prediction result can be consumed by the application.

### Model Evaluation

- [ ] Model evaluation result is recorded.
- [ ] Evaluation method is documented.
- [ ] Actual measured results are recorded.
- [ ] No fabricated performance numbers are reported.

---

## 2. Application

### React Application

- [ ] React application starts successfully.
- [ ] Main Supply Prescript screen loads.
- [ ] Required Week 1 UI foundation exists.
- [ ] No critical UI error prevents the application from loading.

### Database Connection

- [ ] PostgreSQL or Snowflake connection is configured.
- [ ] Database configuration is documented.
- [ ] Actual database connectivity is verified when the database is available.

If the database foundation is not yet available:

`Historical — BLOCKED (02/09/2026): database foundation not yet available`

The database must not be marked PASS without actual connectivity evidence.

---

## 3. Evidence Sources

| Area | Evidence |
|---|---|
| XGBoost baseline | Chetan PR / implementation |
| Shipment-delay prediction | Chetan PR / model output |
| Model evaluation | Chetan implementation/evaluation result |
| React application | Yoshita PR / application screenshot |
| Database connection | Yoshita + Mansi implementation/evidence |

---

## 4. Test Status

Current status:

- Predictive Model: PASS
- Shipment-delay Prediction: PASS
- Model Evaluation: PASS
- React Application: PASS
- Database Connection: Historical — BLOCKED (02/09/2026)

Statuses will be updated only after actual implementation evidence is available.

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
