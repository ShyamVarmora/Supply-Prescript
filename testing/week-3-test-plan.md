# Supply Prescript — Week 3 QA Test Plan

## Purpose

This document defines the QA checks for the Week 3 closed-loop evaluation and Decision ROI requirements.

The checks are based directly on the Week 3 project requirements.

No test is marked as PASS until supporting implementation evidence is available.

No fabricated evaluation results or ROI percentages will be reported.

---

## 1. Closed Loop Evaluation

- [ ] A recorded decision can be identified.
- [ ] Predicted cost is available.
- [ ] Actual historical outcome is available.
- [ ] Predicted cost is compared against actual cost.
- [ ] Difference/discrepancy is calculated.
- [ ] Evaluation result is persisted or retrievable.
- [ ] Evaluation does not use fabricated values.

### Evaluation Flow

```text
Decision
    ↓
Predicted Cost
    ↓
Actual Cost
    ↓
Closed-Loop Evaluation
```

## 2. Decision ROI

- [ ] Decision ROI is calculated from real evaluated decisions.
- [ ] Positive business outcomes are tracked.
- [ ] Total evaluated decisions can be counted.
- [ ] ROI is displayed in the analytics UI.
- [ ] No fabricated ROI percentage is displayed.
- [ ] Empty state is shown when evaluation data is unavailable.

## 3. Evaluation Scenarios

### Scenario 1 — Positive Outcome

- [ ] Recorded decision exists.
- [ ] Predicted cost exists.
- [ ] Actual cost exists.
- [ ] Evaluation identifies the outcome correctly.

### Scenario 2 — Negative Outcome

- [ ] Predicted and actual results differ.
- [ ] Discrepancy is detected.

### Scenario 3 — Missing Outcome

- [ ] Decision exists.
- [ ] Actual outcome is unavailable.
- [ ] Evaluation remains pending.
- [ ] ROI is not calculated from incomplete data.

### Scenario 4 — Multiple Decisions

- [ ] Multiple evaluated decisions are counted.
- [ ] Positive outcomes are counted.
- [ ] Decision ROI is calculated from real results.

---

## 4. Evidence Rules

A test must not be marked PASS without supporting implementation evidence.

Acceptable evidence may include:

- Evaluation script output
- Implementation code
- Pull request
- API response
- Database record
- Analytics UI screenshot
- Actual historical outcome data

No fabricated cost, outcome, evaluation result, or ROI percentage should be reported.

---

## 5. Current Status

| Requirement | Status |
|---|---|
| Recorded decision identification | Pending |
| Predicted cost availability | Pending |
| Actual historical outcome | Pending |
| Predicted vs actual comparison | Pending |
| Discrepancy calculation | Pending |
| Evaluation persistence/retrieval | Pending |
| Decision ROI calculation | Pending |
| Positive outcomes count | Pending |
| Total evaluated decisions count | Pending |
| ROI displayed in analytics UI | Pending |
| Empty state | Pending |

---

## 6. QA Conclusion

Week 3 validation remains pending until the closed-loop evaluation implementation and Decision ROI UI provide actual supporting evidence.

No unverified test results or fabricated ROI values will be reported.
