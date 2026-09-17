# Supply Prescript — Week 2 QA Test Plan

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

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
- Final model checksum and timestamp recorded in 	testing/final-qa-matrix.md.
- Browser closed-loop E2E completed successfully.

---

## Final integrated verification — 17/09/2026

Historical evidence above is retained for audit continuity. This section records the latest final-QA status.

- Direct POST /predict/shipment-delay: HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.
- Backend automated tests: 12 passed, 2 skipped, 1 warning in 2.85s.
- Current local PostgreSQL integration rerun: BLOCKED because localhost:5432 is unavailable on this PC.
- Frontend lint: PASS.
- Frontend build: PASS; 19 modules transformed.
- git diff --check: clean.
- Historical live-PostgreSQL evidence remains preserved in the document above.
