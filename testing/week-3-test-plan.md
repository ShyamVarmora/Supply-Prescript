# Supply Prescript — Week 3 QA Test Plan

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

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
    —
Predicted Cost
    —
Actual Cost
    —
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
- [x] Historical 02/09/2026 standalone evaluation verification; operational database-backed evaluation was IN PROGRESS at that time.
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
| Recorded decision identification | Historical — IN PROGRESS (02/09/2026) |
| Predicted cost availability | PASS |
| Actual historical outcome | Historical — NOT STARTED (02/09/2026) |
| Predicted vs actual comparison | PASS |
| Discrepancy calculation | PASS |
| Evaluation persistence/retrieval | Historical — IN PROGRESS (02/09/2026) |
| Decision ROI calculation | Historical — IN PROGRESS (02/09/2026) |
| Positive outcomes count | Historical — NOT STARTED (02/09/2026) |
| Total evaluated decisions count | Historical — NOT STARTED (02/09/2026) |
| ROI displayed in analytics UI | Historical — IN PROGRESS (02/09/2026) |
| Empty state | PASS |

---

## 6. QA Conclusion

Week 3 standalone evaluation logic has been verified with actual execution evidence. Database-backed closed-loop evaluation, real outcomes, and real ROI remain unverified.

No unverified test results or fabricated ROI values will be reported.

## Final Verification Update - 2026-09-14

Final integrated verification was performed against the current devops implementation.

- PostgreSQL verified with 5 required tables and live row counts.
- Prediction persisted in predictions for record 1.
- Three recommendations verified.
- Budget, time and capacity constraints verified.
- Decision 50 executed and persisted.
- Actual outcome 44 persisted for Decision 50.
- Evaluation returned discrepancy_detected and ROI 12.377519407267744%.
- ROI analytics returned 8 evaluated decisions, 5 positive outcomes, 3 negative outcomes, 62.5% positive rate, average ROI -0.30889857936569803%.
- Retraining timestamp persisted for Decision 50.
- Final model checksum and timestamp recorded in testing/final-qa-matrix.md.
- Browser closed-loop E2E completed successfully.

---

## Final integrated verification — 17/09/2026

Historical evidence above is retained for audit continuity. This section records the latest final-QA status.

- Direct POST /predict/shipment-delay: HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.
- Backend automated tests: 12 passed, 2 skipped, 1 warning in 12.37s.
- Current local PostgreSQL integration rerun: BLOCKED because localhost:5432 is unavailable on this PC; the latest run ended with KeyboardInterrupt after 34.96s and no PostgreSQL test passed.
- Frontend lint: PASS.
- Frontend build: PASS; 19 modules transformed.
- git diff --check: clean.
- Historical live-PostgreSQL evidence remains preserved in the document above.
