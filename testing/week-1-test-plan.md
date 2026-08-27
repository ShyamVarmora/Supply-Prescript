# Supply Prescript — Week 1 QA Test Plan

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

`BLOCKED — database foundation not yet available`

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

- Predictive Model: Pending
- Shipment-delay Prediction: Pending
- Model Evaluation: Pending
- React Application: Pending
- Database Connection: Pending

Statuses will be updated only after actual implementation evidence is available.
