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

# Historical development-phase checklist

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

## Final verification table — integrated run 12/09/2026

> This table is the final functional verification state. The successful 12/09/2026 integrated PostgreSQL/browser run remains the evidence baseline; documentation-only cleanup followed with no implementation changes.

| Requirement | 12/09/2026 integrated verification |
|---|---|
| Predictive model and shipment-delay prediction | PASS — implemented and verified with actual evidence |
| Historical supply-chain data | PASS — dataset and live workflow evidence recorded |
| Optimization and hard constraints | PASS — budget, time, and capacity scenarios verified |
| Three recommendation alternatives | PASS — integrated recommendation workflow verified |
| Prescriptive UI | PASS — recommendation cards and trade-offs verified |
| Decision execution and database write-back | PASS — live PostgreSQL verification completed |
| Actual outcome capture | PASS — outcome persistence verified |
| Evaluation and closed-loop comparison | PASS — pending, within-threshold, and discrepancy behavior verified |
| Decision ROI and analytics | PASS — real evaluated decision workflow verified |
| Discrepancy-triggered retraining | PASS — retraining path and metadata verified |
| Frontend lint and production build | PASS — lint passed; build completed with 19 modules transformed |
| Full integrated E2E workflow | PASS — Record → Generate → Prediction → Alternatives → Execute → Outcome → Evaluation → ROI → Analytics |

## QA-machine rerun — 17/09/2026

> Environment-only rerun on the final-QA PC. This does not modify or invalidate the successful 12/09/2026 functional verification.

| Check | 17/09/2026 result |
|---|---|
| Backend automated suite | PASS — 12 passed, 2 skipped, 1 warning in 12.37s |
| PostgreSQL integration suite | BLOCKED — localhost:5432 unavailable; run ended after 34.96s with KeyboardInterrupt and no PostgreSQL test passed |
| Frontend lint | PASS |
| Frontend production build | PASS — 19 modules transformed |
| git diff --check | CLEAN |
