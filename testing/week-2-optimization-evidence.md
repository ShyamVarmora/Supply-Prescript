# Week 2 Optimization Evidence

## Scope

Final Week 2 evidence for the integrated `devops` implementation.

## Optimization

The backend uses `scipy.optimize.linprog` to generate three solver-backed alternatives with budget, time and capacity feasibility information.

### Normal Final Scenario

Configuration used in the final recommendation workflow:

- Budget: 700
- Allowed time: 20
- Available capacity: 100
- Shipment time: 10
- Shipment capacity: 50

Three alternatives returned:

| Option | Cost | Time | Capacity | Feasible |
|---|---:|---:|---:|---|
| Air Freight | 684.7557795 | 5.5 | 50 | Yes |
| Secondary Supplier | 547.8046236 | 8 | 50 | Yes |
| Delay Launch | 45.6503853 | 15.67630672454834 | 50 | Yes |

Recommended option: `Air Freight`

## Constraint Verification

### Budget Failure

Tested budget: `40`.

The budget-failure case produced no feasible alternative and `recommended_option = null`.

### Time Constraint

Restrictive time handling was covered by the optimizer tests; options exceeding the configured allowed time are marked infeasible.

### Capacity Constraint

Restrictive capacity handling was covered by the optimizer tests; options exceeding available capacity are marked infeasible.

### Infeasible Selection

The frontend disables selection of infeasible recommendations, so an infeasible option cannot be executed through the normal UI flow.

## Final Status

| Requirement | Status |
|---|---|
| SciPy optimization | PASS |
| Budget constraint | PASS |
| Time constraint | PASS |
| Capacity constraint | PASS |
| Three alternatives | PASS |
| Feasibility handling | PASS |
| Cost vs speed data | PASS |

## Evidence Rule

The final evidence distinguishes three generated alternatives from the number of feasible alternatives in a given constraint scenario. No unsupported or fabricated result is claimed.
