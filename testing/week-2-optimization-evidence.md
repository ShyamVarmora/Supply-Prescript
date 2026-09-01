# Week 2 Optimization Evidence

## Purpose

Evidence for the prescriptive optimization solver implemented on the
backend branch.

Only tests that were actually executed are marked PASS.

---

## Test 1 — Normal Constraints

**Status: PASS**

The prescriptive optimization solver was executed with:

- Budget: 1000
- Allowed time: 10
- Available capacity: 100
- Shipment cost: 456.503853
- Shipment time: 8
- Shipment capacity: 50

Observed result:

- Air Freight: feasible
- Secondary Supplier: feasible
- Delay Launch: infeasible
- Recommended option: Air Freight

Evidence:

- Terminal optimizer output
- Swagger `/recommend` response

---

## Test 2 — Budget Constraint

**Status: NOT YET VERIFIED**

A dedicated budget-boundary test has not yet been executed with
otherwise feasible time and capacity constraints.

The existing restrictive test confirmed that no feasible recommendation
is returned when multiple constraints are restrictive, but it does not
isolate the budget constraint.

A dedicated budget-only boundary test is still required.

---

## Test 3 — Capacity Constraint

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

## Test 4 — Time Constraint

**Status: PASS**

The normal solver execution showed that an alternative exceeding the
allowed time was rejected.

Observed:

- Delay Launch time: 17.11
- Allowed time: 10
- Delay Launch: infeasible

The solver did not select the alternative that exceeded the configured
time constraint.

Evidence:

- Terminal optimizer output
- Swagger `/recommend` response

---

## Test 5 — Three Alternatives Generated

**Status: NOT YET VERIFIED**

The solver currently generates three business alternatives:

1. Air Freight
2. Secondary Supplier
3. Delay Launch

However, the tested normal scenario produced only two feasible
alternatives.

Therefore, the requirement for three feasible alternatives has not yet
been fully verified.

Three hard-coded UI cards are not being used as proof.

Evidence:

- `backend/ml/optimizer.py`
- Swagger `/recommend` response

A test scenario where all three alternatives satisfy the configured
constraints is still required.

---

## Test 6 — Infeasible Option Rejected

**Status: PASS**

A deliberately restrictive case was tested.

Observed:

- Option 1: infeasible
- Option 2: infeasible
- Option 3: infeasible
- `feasible_alternatives`: `[]`
- `recommended_option`: `null`
- `objective`: `null`

No infeasible option was returned as the recommendation.

Evidence:

- Swagger `/recommend` response

---

## Test 7 — Cost vs Speed Values

**Status: PASS**

The generated alternatives contain actual numeric cost and time values.

Examples from the tested scenario:

- Air Freight: cost 684.76, time 4.40
- Secondary Supplier: cost 547.80, time 6.40
- Delay Launch: cost 45.65, time 17.11

The alternatives therefore expose different cost-versus-speed trade-offs.

Evidence:

- Terminal optimizer output
- Swagger `/recommend` response

---

## Test 8 — API Integration

**Status: PASS**

The existing `/recommend` endpoint successfully calls the optimization
logic.

Observed:

- HTTP 200 response
- Prediction returned
- Optimization result returned
- Alternatives returned
- Cost values returned
- Time values returned
- Capacity values returned
- Feasibility information returned
- Recommended option returned when a feasible solution exists

Evidence:

- Swagger `/recommend` response

---

## Current Verification Summary

| Test | Status |
|---|---|
| W2-01 Optimization exists | PASS |
| W2-02 Budget constraint | NOT YET VERIFIED |
| W2-03 Time constraint | PASS |
| W2-04 Capacity constraint | PASS |
| W2-05 Three feasible alternatives | NOT YET VERIFIED |
| W2-06 Cost vs Speed | PASS |
| W2-07 Execute Decision | BLOCKED |
| W2-08 Evidence requirement | PASS |

---

## W2-07 — Execute Decision

**Status: BLOCKED**

Dependency:

- Backend write-back endpoint
- Database INSERT functionality

Execute Decision is not marked PASS because the current backend does
not provide verified database write-back evidence.

---

## Evidence Rule

A test is marked PASS only when the implementation was actually
executed and evidence was recorded.

Creating a file or planned implementation is not sufficient evidence
for PASS.