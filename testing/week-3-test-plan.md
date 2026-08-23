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
Recorded Decision
       ↓
Predicted Cost
       ↓
Actual Historical Outcome
       ↓
Predicted vs Actual Comparison
       ↓
Difference / Discrepancy
       ↓
Closed-Loop Evaluation
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
