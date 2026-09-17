# Supply Prescript — Project 3 Requirement Checklist

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Predictive Model

- XGBoost or appropriate predictive model is implemented.
- Historical supply-chain data is used.
- Disruption / shipment-delay prediction is produced.
- Model evaluation result is recorded.
- No fabricated performance numbers are reported.

## Prescriptive Solver

- Optimization is implemented.
- Budget constraint is enforced.
- Time constraint is considered.
- Capacity constraint is considered.
- Three best alternative actions are generated.

## Operational UI

- React / Retool application exists.
- Recommendations are displayed.
- Cost vs Speed trade-offs are shown.
- User can execute a decision.
- Analyst can participate in the decision workflow.

## Write-Back

- Decision is inserted into the operational database.
- Decision data is persisted correctly.

## Closed Loop

- Predicted cost is compared with actual outcome.
- Actual outcome is captured.
- Closed-loop comparison is available.

## Decision ROI

- Decision ROI is calculated.
- Decision ROI is displayed.

## Continuous Learning

- Discrepancies between predictions and actual outcomes are detected.
- Discrepancies can trigger model retraining.
- XGBoost retraining workflow is implemented where applicable.

## Final Workflow

- Analyst can actively participate in the decision workflow.
- Analyst can review recommendations and trade-offs.
- Analyst can execute the selected decision.

---

# Current Development Phase

## Week 1

### Predictive Baseline

- XGBoost baseline.
- Historical mock supply-chain data.
- Shipment-delay prediction.
- Model evaluation result is recorded from actual evidence.

### App Scaffolding

- React application.
- Main Supply Prescript screen loads.
- Required Week 1 UI foundation exists.
- PostgreSQL / Snowflake connection is configured.
- Actual database connectivity is verified when the database is available.

### QA Rule

- No fabricated performance numbers are reported.
- Requirements are marked PASS only after actual implementation evidence is available.
      ---

# Week 2

## Mathematical Optimization

- Business constraints are defined.
- SciPy linear-programming solver is implemented.
- Three alternative actions are generated.

## Prescriptive UI

- Three prescription cards are displayed.
- Cost is displayed.
- Speed/time is displayed.
- Cost-vs-speed trade-off is displayed.

## Mid-Project Validation

- Hard budget constraint is verified.
- Execute Decision is tested.
- Database INSERT is verified.
      
# Week 3

## Closed Loop

- Evaluation script implemented.
- Predicted cost is compared with actual historical outcome.
- Actual outcome is captured.
- Discrepancy is calculated.

## Decision ROI

- Decision ROI is calculated.
- Positive business outcomes are tracked.
- Decision ROI is displayed in the analytics UI.

---

## Final integrated verification — 17/09/2026

Historical planning/status material above is retained for audit continuity.

- [x] Historical supply-chain dataset reference retained: 113097 CSV rows.
- [x] Direct POST /predict/shipment-delay verified with HTTP 200.
- [x] Direct prediction result recorded: predicted_delivery_time_deviation = 5.67630672454834.
- [x] Budget, time, and capacity constraint tests passed.
- [x] Evaluation tests passed for pending, within-expected-range, and discrepancy behavior.
- [x] Discrepancy-triggered XGBoost retraining behavior verified by tests.
- [x] Frontend lint passed.
- [x] Frontend production build passed; 19 modules transformed.
- [x] git diff --check is clean.
- [x] Historical live-PostgreSQL evidence is preserved separately.
- Current local PostgreSQL integration rerun remains BLOCKED because localhost:5432 is unavailable on this PC.
