# Supply Prescript — Week 2 Validation

## Purpose

Final Week 2 validation for the integrated `devops` implementation.

## W2-01 — Optimization Exists

- SciPy `linprog` is used by `backend/ml/optimizer.py`.
- The optimizer executes successfully through `/recommend`.
- Solver-generated alternatives include cost, time, capacity, expected impact and feasibility.

**Status: PASS**

## W2-02 — Budget Constraint

Final hard-budget test:

- Budget: `40`
- Other valid constraints retained.

Actual result:

- `feasible_alternatives = []`
- `recommended_option = null`
- status = `no_feasible_solution`

**Status: PASS**

## W2-03 — Time Constraint

Restrictive time handling was verified in optimizer tests. Alternatives whose time exceeds the configured maximum are marked infeasible and are not executable.

**Status: PASS**

## W2-04 — Capacity Constraint

Restrictive capacity handling was verified in optimizer tests. Alternatives whose capacity requirement exceeds available capacity are marked infeasible and are not executable.

**Status: PASS**

## W2-05 — Three Alternatives

The optimizer returns these three alternatives:

1. Air Freight
2. Secondary Supplier
3. Delay Launch

The normal final scenario with budget 700, allowed time 20 and available capacity 100 returned all three as feasible.

**Status: PASS**

## W2-06 — Cost vs Speed

The final recommendation response contained actual backend cost/time values for all three alternatives.

**Status: PASS**

## W2-07 — Execute Decision

Actual integrated verification was completed.

- Feasible recommendation selected: Air Freight
- Decision ID: 50
- Decision persisted in PostgreSQL `decision_log`
- SQL verification completed

**Status: PASS**

## Final Validation Summary

| Test | Status |
|---|---|
| Optimization exists | PASS |
| Budget constraint | PASS |
| Time constraint | PASS |
| Capacity constraint | PASS |
| Three alternatives | PASS |
| Cost vs speed | PASS |
| Execute Decision / database INSERT | PASS |

## PostgreSQL Verification

Database: `supply_prescript_db`

Required tables verified:

- `supply_chain_data`
- `predictions`
- `prescriptive_recommendations`
- `decision_log`
- `actual_outcomes`

Historical CSV row count of 113097 is documented separately and is not treated as the PostgreSQL operational row count.

## Final Automated QA

```text
pytest backend/tests -v
14 passed, 1 warning

RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v
2 passed, 1 warning

npm.cmd --prefix frontend run lint
PASS

npm.cmd --prefix frontend run build
PASS; Vite 8.2.1; 19 modules transformed
```
