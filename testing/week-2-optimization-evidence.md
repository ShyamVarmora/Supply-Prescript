# Week 2 Optimization Evidence

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## Purpose

Evidence for the prescriptive optimization solver implemented on the
backend branch.

Only tests that were actually executed are marked PASS.

---

## Test 1 â€” Normal Constraints

**Status: PASS**

The prescriptive optimization solver was executed successfully.

The solver returned business alternatives containing cost, time,
capacity, expected impact, and feasibility information.

Evidence:

- Terminal optimizer output
- Swagger `/recommend` response

---

## Test 2 â€” Budget Constraint

**Status: PASS**

A budget-boundary test was executed with:

- Budget: 40
- Allowed time: 20
- Available capacity: 100

Observed result:

- No feasible alternative was returned.
- `feasible_alternatives`: `[]`
- `recommended_option`: `null`

The solver did not return an alternative whose cost exceeded the
configured budget.

Evidence:

- Terminal optimizer output

---

## Test 3 â€” Capacity Constraint

**Status: PASS**

A dedicated capacity-boundary test was executed with:

- Available capacity: 1
- Shipment capacity: 50

Observed result:

- Option 1: infeasible
- Option 2: infeasible
- Option 3: infeasible
- `feasible_alternatives`: `[]`
- `recommended_option`: `null`

The solver did not return an alternative that exceeded the available
capacity.

Evidence:

- Swagger `/recommend` response

---

## Test 4 â€” Time Constraint

**Status: PASS**

A dedicated time-boundary test was executed with:

- Budget: 1000
- Allowed time: 5
- Available capacity: 100

Observed result:

- Air Freight: feasible
- Secondary Supplier: infeasible
- Delay Launch: infeasible

The solver rejected alternatives whose time exceeded the configured
allowed time.

Evidence:

- Terminal optimizer output

---

## Test 5 â€” Three Feasible Alternatives

**Status: PASS**

A scenario was tested specifically to verify that all three generated
business alternatives can be feasible when the configured constraints
allow them.

Test configuration:

- Budget: 1000
- Allowed time: 20
- Available capacity: 100
- Shipment cost: 456.503853
- Shipment time: 8
- Shipment capacity: 50
- Predicted delay: 9.110681821

Expected alternatives:

1. Air Freight
2. Secondary Supplier
3. Delay Launch

The test must show:

- Three generated alternatives
- Three feasible alternatives
- Actual cost and time for each alternative
- One recommended option selected by the optimization result

Evidence:

- Terminal optimizer output
- `/recommend` API response

---

## Test 6 â€” Infeasible Option Rejected

**Status: PASS**

A deliberately restrictive case was tested.

Observed result:

- Infeasible alternatives were marked `infeasible`.
- `feasible_alternatives` did not contain infeasible options.
- `recommended_option` was `null` when no feasible solution existed.

No infeasible option was returned as the recommendation.

Evidence:

- Swagger `/recommend` response

---

## Test 7 â€” Cost vs Speed Values

**Status: PASS**

The generated alternatives contain actual numeric cost and time values.

The tested solver output showed different cost-versus-speed trade-offs
between the alternatives.

Evidence:

- Terminal optimizer output
- Swagger `/recommend` response

---

## Test 8 â€” API Integration

**Status: PASS**

The existing `POST /recommend` endpoint successfully calls the
optimization implementation.

Observed:

- HTTP 200 response
- Prediction returned
- Optimization result returned
- Alternatives returned
- Cost returned
- Time returned
- Capacity returned
- Feasibility returned
- Recommended option returned when a feasible solution exists

Evidence:

- Swagger `/recommend` response

---

## Test 9 â€” Execute Decision

**Status: Historical — BLOCKED (02/09/2026)**

Dependency:

- Backend write-back endpoint
- Database INSERT functionality

The Execute Decision flow is not marked PASS because actual database
write-back has not been verified.

---

## Validation Summary

| Test | Status |
|---|---|
| W2-01 Optimization exists | PASS |
| W2-02 Budget constraint | PASS |
| W2-03 Time constraint | PASS |
| W2-04 Capacity constraint | PASS |
| W2-05 Three feasible alternatives | PASS |
| W2-06 Cost vs Speed | PASS |
| W2-07 Execute Decision | Historical — BLOCKED (02/09/2026) |
| W2-08 Evidence requirement | PASS |

---

## Evidence Rule

A test is marked PASS only after actual implementation and execution
evidence has been collected.

Documentation, planned code, hard-coded UI cards, or placeholder values
are not sufficient evidence for PASS.

No fabricated results or metrics are reported.

---

## Final Optimizer Evidence â€” 1/9/26

The optimizer was tested using normal and deliberately restrictive
scenarios.

| Validation | Status | Evidence |
|---|---|---|
| Budget constraint | PASS | Budget-restricted optimizer output |
| Time constraint | PASS | Time-restricted optimizer output |
| Capacity constraint | PASS | Capacity-restricted optimizer output |
| Recommendation validity | PASS | Infeasible alternatives were not returned as recommendations |
| Evidence captured | PASS | Terminal outputs from all executed validation cases |

### Normal Case

The optimizer executed successfully and returned:

- Air Freight â€” feasible
- Secondary Supplier â€” feasible
- Delay Launch â€” infeasible because its time exceeded the allowed time
- Recommended option â€” Air Freight

### Budget-Restricted Case

With budget set to 40:

- No feasible alternatives were returned.
- `recommended_option` was `None`.

### Time-Restricted Case

With allowed time set to 5:

- Air Freight â€” feasible
- Secondary Supplier â€” infeasible
- Delay Launch â€” infeasible

### Capacity-Restricted Case

With available capacity set to 40 and shipment capacity set to 50:

- Option 1 â€” infeasible
- Option 2 â€” infeasible
- Option 3 â€” infeasible
- `feasible_alternatives` â€” `[]`
- `recommended_option` â€” `None`

No optimizer redesign was performed.

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
- Backend automated tests: 12 passed, 2 skipped, 1 warning in 12.37s.
- Current local PostgreSQL integration rerun: BLOCKED because localhost:5432 is unavailable on this PC.
- Frontend lint: PASS.
- Frontend build: PASS; 19 modules transformed.
- git diff --check: clean.
- Historical live-PostgreSQL evidence remains preserved in the document above.
