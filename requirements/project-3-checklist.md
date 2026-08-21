# Supply Prescript — Project 3 Requirement Checklist

## Predictive Model

- [ ] XGBoost or appropriate predictive model is implemented.
- [ ] Historical supply-chain data is used.
- [ ] Disruption / shipment-delay prediction is produced.
- [ ] Model evaluation result is recorded.
- [ ] No fabricated performance numbers are reported.

## Prescriptive Solver

- [ ] Optimization is implemented.
- [ ] Budget constraint is enforced.
- [ ] Time constraint is considered.
- [ ] Capacity constraint is considered.
- [ ] Three best alternative actions are generated.

## Operational UI

- [ ] React / Retool application exists.
- [ ] Recommendations are displayed.
- [ ] Cost vs Speed trade-offs are shown.
- [ ] User can execute a decision.
- [ ] Analyst can participate in the decision workflow.

## Write-Back

- [ ] Decision is inserted into the operational database.
- [ ] Decision data is persisted correctly.

## Closed Loop

- [ ] Predicted cost is compared with actual outcome.
- [ ] Actual outcome is captured.
- [ ] Closed-loop comparison is available.

## Decision ROI

- [ ] Decision ROI is calculated.
- [ ] Decision ROI is displayed.

## Continuous Learning

- [ ] Discrepancies between predictions and actual outcomes are detected.
- [ ] Discrepancies can trigger model retraining.
- [ ] XGBoost retraining workflow is implemented where applicable.

## Final Workflow

- [ ] Analyst can actively participate in the decision workflow.
- [ ] Analyst can review recommendations and trade-offs.
- [ ] Analyst can execute the selected decision.

---

# Current Development Phase

## Week 1

### Predictive Baseline

- [ ] XGBoost baseline.
- [ ] Historical mock supply-chain data.
- [ ] Shipment-delay prediction.
- [ ] Model evaluation result is recorded from actual evidence.

### App Scaffolding

- [ ] React application.
- [ ] Main Supply Prescript screen loads.
- [ ] Required Week 1 UI foundation exists.
- [ ] PostgreSQL / Snowflake connection is configured.
- [ ] Actual database connectivity is verified when the database is available.

### QA Rule

- [ ] No fabricated performance numbers are reported.
- [ ] Requirements are marked PASS only after actual implementation evidence is available.
      ---

# Week 2

## Mathematical Optimization

- [ ] Business constraints are defined.
- [ ] SciPy linear-programming solver is implemented.
- [ ] Three alternative actions are generated.

## Prescriptive UI

- [ ] Three prescription cards are displayed.
- [ ] Cost is displayed.
- [ ] Speed/time is displayed.
- [ ] Cost-vs-speed trade-off is displayed.

## Mid-Project Validation

- [ ] Hard budget constraint is verified.
- [ ] Execute Decision is tested.
- [ ] Database INSERT is verified.
