# Supply Prescript — Project 3 QA Test Plan

## 1. Purpose

This document defines the QA testing plan for the complete Supply Prescript Project 3 lifecycle.

Testing covers the predictive model, prescriptive optimization, operational UI, database write-back, closed-loop validation, decision ROI, continuous learning, and final analyst workflow.

No Project 3 functionality has been marked as PASS at this stage unless actual implementation evidence is available.

---

## 2. Predictive Model

### Historical Supply-Chain Data

- [ ] Historical supply-chain data loads correctly.
- [ ] Required input fields are available.
- [ ] Data can be consumed by the predictive model.

### Predictive Model

- [ ] XGBoost or the implemented predictive model trains successfully.
- [ ] Disruption / shipment-delay prediction is produced.
- [ ] Prediction output is generated for valid input data.
- [ ] Model evaluation result is recorded.
- [ ] Actual measured performance is documented.
- [ ] No fabricated performance numbers are reported.

---

## 3. Prescriptive Solver

### Optimization

- [ ] Optimization workflow executes successfully.
- [ ] Budget constraint is enforced.
- [ ] Time constraint is considered.
- [ ] Capacity constraint is considered.
- [ ] Three best alternative actions are generated.
- [ ] Generated recommendations are based on available input data.

---

## 4. Operational UI

### Application

- [ ] React / Retool application starts successfully.
- [ ] Main Supply Prescript screen loads.
- [ ] Recommendations are displayed.
- [ ] Cost vs Speed trade-offs are shown.
- [ ] User can execute a decision.
- [ ] Analyst can participate in the decision workflow.

---

## 5. Write-Back

### Operational Database

- [ ] Decision is inserted into the operational database.
- [ ] Decision data is persisted correctly.
- [ ] Stored decision can be retrieved.
- [ ] Write-back does not create unintended duplicate records.

---

## 6. Closed Loop

### Outcome Verification

- [ ] Predicted cost is recorded.
- [ ] Actual outcome is captured.
- [ ] Predicted cost can be compared with actual outcome.
- [ ] Difference between predicted and actual outcome is calculated or displayed.

---

## 7. Decision ROI

### ROI

- [ ] Decision ROI is calculated using actual available data.
- [ ] ROI result is displayed.
- [ ] ROI is traceable to the corresponding decision and outcome.

No ROI value should be documented unless it has been actually calculated and verified.

---

## 8. Continuous Learning

### Retraining

- [ ] Prediction discrepancies can be detected.
- [ ] Discrepancy information is recorded.
- [ ] Retraining trigger behavior is verified.
- [ ] XGBoost retraining workflow is verified where implemented.
- [ ] Retraining does not use fabricated evaluation results.

---

## 9. Database Connectivity

- [ ] PostgreSQL or Snowflake connection is configured where required.
- [ ] Database configuration is documented.
- [ ] Actual database connectivity is verified when the database is available.

If the database foundation is unavailable:

`BLOCKED — database foundation not yet available`

Database connectivity must not be marked PASS without actual evidence.

---

## 10. Final Analyst Workflow

- [ ] Analyst can review the prediction.
- [ ] Analyst can review recommended actions.
- [ ] Analyst can compare cost vs speed trade-offs.
- [ ] Analyst can participate in the decision.
- [ ] Analyst can execute the selected decision.
- [ ] Decision is written back to the operational database.
- [ ] Actual outcome can be used for closed-loop analysis.

---

## 11. Test Evidence Rules

The following rules apply to all QA results:

- Do not mark a test PASS without actual evidence.
- Do not invent model accuracy or performance numbers.
- Do not mark database connectivity PASS without actual connectivity evidence.
- Record implementation evidence from the relevant PR, screenshot, test output, or application result.
- Use BLOCKED when a required dependency is genuinely unavailable.

---

## 12. Overall Test Status

**Current Status: Pending**

No Project 3 functionality is marked as PASS until implementation and verification evidence is available.
