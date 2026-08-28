# Supply Prescript — Week 2 Validation

## Purpose

This document defines the Week 2 validation and evidence checks for the optimization engine and prescriptive UI.

The tests verify the actual implementation rather than treating planned documentation or hard-coded UI cards as proof.

No test is marked PASS without actual implementation and verification evidence.

---

## Test W2-01 — Optimization Exists

### Objective

Verify that the project contains a real SciPy optimization implementation.

### Checks

- [ ] SciPy is available in the project environment.
- [ ] A real SciPy optimization/linear-programming implementation exists.
- [ ] The optimization solver can be executed.
- [ ] The solver returns a valid result.
- [ ] The result contains recommendation/action data.

### Expected

The SciPy solver executes successfully and produces a valid optimization result.

### Evidence

For a PASS result, record:

- Terminal output
- Test output
- Relevant implementation path
- Screenshot if applicable

### Status

NOT STARTED — no verified solver execution evidence yet.

---

## Test W2-02 — Budget Constraint

### Objective

Verify that the optimization respects the configured maximum budget.

### Normal Budget Case

Input a case where the available budget is limited.

### Checks

- [ ] Configured maximum budget is identified.
- [ ] Candidate action costs are provided to the solver.
- [ ] Solver applies the budget constraint.
- [ ] Recommended cost is less than or equal to the configured maximum budget.

### Expected

```text
recommended cost <= configured maximum budget
