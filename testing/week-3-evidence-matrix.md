# Supply Prescript — Week 3 Evidence Matrix

## Purpose

This document maps the Week 3 requirements from the project specification to the implementation evidence that must be collected before the requirements can be marked complete.

No requirement is marked PASS without actual implementation evidence.

---

## 1. Closed-Loop Evaluation

### Requirement

Compare the predicted cost of the user's selected decision against the actual historical outcome stored in the database.

### Required Evidence

- [ ] Selected decision can be identified.
- [ ] Predicted cost is stored or retrievable.
- [ ] Actual historical outcome is stored or retrievable.
- [ ] Predicted cost is compared with actual outcome.
- [ ] Difference/discrepancy is calculated.
- [ ] Evaluation result can be retrieved.
- [ ] Evidence comes from real implementation/data.

### Evidence to Collect

- Backend implementation
- API response
- Database record
- Evaluation output
- Screenshot showing the result

### Status

PENDING — implementation not yet available.

This follows the PDF directly. The PDF does not merely ask for a UI mockup; it requires comparison against the actual historical database outcome.

---

## 2. Decision ROI

### Requirement

Build an analytics view showing Decision ROI and tracking how often AI recommendations result in positive business outcomes.

### Required Evidence

- [ ] ROI is calculated from real evaluated decisions.
- [ ] Positive business outcomes are identified.
- [ ] Total evaluated decisions can be counted.
- [ ] ROI is displayed in the UI.
- [ ] ROI can be traced to actual decision/outcome data.
- [ ] No hard-coded ROI percentage is used.

### Evidence to Collect

- Backend/API result
- Database records
- ROI calculation
- Analytics UI screenshot
- Test result

### Status

PENDING — implementation not yet available.

Again, this comes directly from the Week 3 requirement.

---

## 3. Dependencies

The following dependencies must exist before Week 3 can be fully verified:

1. Historical supply-chain data
2. Predictive model output
3. Prescriptive recommendation
4. Selected decision
5. Operational database write-back
6. Actual historical outcome
7. Evaluation logic
8. Decision ROI calculation
9. Feedback / analytics UI

If a dependency is unavailable, the related test remains BLOCKED or PENDING.

A missing dependency must not be replaced with fabricated data.

---

## Evidence Table

| Requirement | Implementation Evidence | Data Evidence | UI Evidence | Status |
|---|---|---|---|---|
| Predicted cost available | Pending | Pending | Pending | PENDING |
| Actual outcome available | Pending | Pending | Pending | PENDING |
| Predicted vs actual comparison | Pending | Pending | Pending | PENDING |
| Discrepancy calculation | Pending | Pending | Pending | PENDING |
| Evaluation persistence/retrieval | Pending | Pending | Pending | PENDING |
| Decision ROI calculation | Pending | Pending | Pending | PENDING |
| Positive outcomes tracking | Pending | Pending | Pending | PENDING |
| ROI displayed in analytics UI | Pending | Pending | Pending | PENDING |

---

## 4. Evidence Rule

The following are not acceptable as proof of completion:

- Hard-coded ROI percentages
- Hard-coded actual costs
- Fake database records
- Screenshots containing fabricated results
- Placeholder values presented as real results
- Documentation claiming PASS without implementation evidence

A requirement can only move from PENDING/BLOCKED to PASS after the corresponding implementation and verification evidence exists.

---

## 5. Current Dependency Status

| Dependency | Status |
|---|---|
| Historical dataset | BLOCKED — pending database work |
| Predictive model | PENDING |
| Prescriptive solver | PENDING |
| Database write-back | PENDING |
| Closed-loop evaluation | PENDING |
| Decision ROI | PENDING |
| Feedback analytics | PENDING |
| Continuous learning | PENDING |

---

## 6. Duplication and Scope Check

- [x] Did not duplicate `Test-plan.md`.
- [x] Did not duplicate `week-3-test-plan.md`.
- [x] Did not modify Yoshita's frontend.
- [x] Did not modify Chetan's backend.
- [x] Did not invent implementation results.
- [x] Did not mark anything PASS.
