# Supply Prescript — Requirement Checklist

## Predictive Model
- [ ] XGBoost / LightGBM predicts disruption probability and duration.
- [ ] Historical supply-chain data is used.

## Prescriptive Solver
- [ ] SciPy / PuLP optimization is implemented.
- [ ] Budget constraint is enforced.
- [ ] Time constraint is considered.
- [ ] Capacity constraint is considered.
- [ ] Three best alternative actions are generated.

## Operational UI
- [ ] React/Retool application exists.
- [ ] Recommendations are displayed.
- [ ] Cost vs Speed trade-offs are shown.
- [ ] User can execute a decision.

## Write-Back
- [ ] Decision is inserted into the operational database.

## Closed Loop
- [ ] Predicted cost is compared with actual outcome.
- [ ] Decision ROI is shown.

## Continuous Learning
- [ ] Discrepancies trigger XGBoost retraining.

## Final Workflow
- [ ] Analyst can actively participate in the decision workflow.
