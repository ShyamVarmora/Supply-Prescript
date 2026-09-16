# Supply Prescript — Week 2 QA Test Plan

## Purpose

Final Week 2 QA checks for the integrated `devops` optimization engine and prescriptive UI.

## 1. Optimization

| Check | Actual Result | Status |
|---|---|---|
| Business constraints | Budget, time and capacity are represented and enforced by the optimizer | PASS |
| Budget constraint | Budget 40 hard-failure case returned no feasible alternative | PASS |
| Time constraint | Restrictive time handling verified by optimizer tests | PASS |
| Capacity constraint | Restrictive capacity handling verified by optimizer tests | PASS |
| SciPy solver | `scipy.optimize.linprog` executed successfully | PASS |
| Three alternatives | Air Freight, Secondary Supplier, Delay Launch generated | PASS |

## 2. Prescriptive UI

| Check | Actual Result | Status |
|---|---|---|
| Recommendation cards | Three live backend-backed cards rendered in final browser workflow | PASS |
| Action identification | Air Freight, Secondary Supplier, Delay Launch visible | PASS |
| Cost display | Backend recommendation costs displayed | PASS |
| Time display | Backend recommendation times displayed | PASS |
| Cost-vs-speed trade-off | Three alternatives exposed different cost/time values | PASS |
| Feasible selection | Air Freight selected in final workflow | PASS |

## 3. Execute Decision / Database

| Check | Actual Result | Status |
|---|---|---|
| Execute Decision control | Final browser workflow executed selected recommendation | PASS |
| Backend write-back | Decision 50 created | PASS |
| Database INSERT | Decision 50 verified in PostgreSQL `decision_log` | PASS |
| Stored decision retrieval | Decision history returned stored decision data | PASS |

## 4. Evidence Rules

PASS requires implementation plus actual execution evidence. Historical CSV volume is not treated as PostgreSQL operational row count.

## 5. Current Status

All Week 2 requirements are synchronized with the final integrated state and are **PASS** where the final evidence supports them.

## 6. Final Automated QA Reference

```text
pytest backend/tests -v
14 passed

RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v
2 passed, 1 warning

npm.cmd --prefix frontend run lint
PASS

npm.cmd --prefix frontend run build
PASS; Vite 8.2.1; 19 modules transformed
```
