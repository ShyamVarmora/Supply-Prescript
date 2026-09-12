# Supply Prescript ??? Week 2 QA Test Plan

## Purpose

This document defines the QA checks for the Week 2 optimization engine and prescriptive UI implementation.

The checks are based on the Week 2 project requirements and will be marked PASS only when supporting implementation evidence is available.

No unverified test results or fabricated values will be reported.

---

## 1. Optimization

### Business Constraints

- [ ] Business constraints are explicitly defined.
- [ ] Budget constraint is enforced.
- [ ] Time constraint is represented.
- [ ] Capacity constraint is represented where applicable.

### Solver

- [ ] SciPy linear-programming solver runs successfully.
- [ ] Solver generates three alternative actions.
- [ ] Generated alternatives satisfy the applicable hard constraints.

---

## 2. Prescriptive UI

- [ ] Three recommendation cards are displayed.
- [ ] Each recommendation has an identifiable action.
- [ ] Cost is displayed for each recommendation.
- [ ] Speed/time is displayed for each recommendation.
- [ ] Cost-versus-speed trade-off is understandable.

---

## 3. Write-Back Preparation

These checks remain NOT STARTED or BLOCKED until the required implementation and verification evidence are available.

- [ ] Execute Decision control exists.
- [ ] Selected recommendation can be identified.
- [ ] Backend receives the selected decision.
- [ ] Database INSERT occurs.
- [ ] Inserted decision can be verified in the operational database.

---

## 4. Evidence Rules

A test must not be marked PASS without supporting evidence.

Evidence may include:

- Implementation code
- Pull request
- Runtime output
- UI screenshot
- Solver output
- Database record
- API response

No final numerical budget, solver performance, or database result should be invented.

---

## 5. Current Status

| Area | Status |
|---|---|
| Business constraints | PASS |
| Budget constraint | PASS |
| Time constraint | PASS |
| Capacity constraint | PASS |
| SciPy LP solver | PASS |
| Three alternative actions | PASS |
| Recommendation cards | IN PROGRESS |
| Cost display | IN PROGRESS |
| Speed/time display | IN PROGRESS |
| Cost-vs-speed trade-off | IN PROGRESS |
| Execute Decision | IN PROGRESS |
| Database INSERT | BLOCKED |

---

## 6. QA Conclusion

Week 2 validation will be completed after the optimization engine and prescriptive UI implementation provide sufficient evidence.

The verified backend optimization checks are PASS. Frontend live-value rendering remains IN PROGRESS, Execute Decision remains IN PROGRESS, and database write-back is BLOCKED.
