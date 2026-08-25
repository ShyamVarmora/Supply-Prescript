# Supply Prescript — Project 3 Requirement Traceability Matrix

## Purpose

This file maps the Project 3 requirements to the code, tests, and evidence we currently have.

A requirement is marked PASS only when the implementation and verification evidence actually exist.

## Status Definitions

- PASS — implemented and verified with actual evidence.
- IN PROGRESS — implementation is currently being developed.
- BLOCKED — required dependency is unavailable.
- NOT STARTED — work has not started.
- FAIL — implementation exists but does not satisfy the requirement.

---

## Week 1 — Predictive Baseline

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| XGBoost predictive baseline | | | | Chetan | |
| Historical mock supply-chain data | | | | Mansi | |
| Shipment-delay prediction | | | | Chetan | |
| React application scaffolding | | | | Yoshita | |
| PostgreSQL / Snowflake connection | | | | Mansi | |

## Week 2 — Optimization & Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Business constraints defined | | | | Chetan/Mansi | |
| SciPy linear-programming solver | | | | Chetan | |
| Three alternative actions | | | | Chetan | |
| Three prescription cards | | | | Yoshita | |
| Cost displayed | | | | Yoshita | |
| Speed/time displayed | | | | Yoshita | |
| Cost vs Speed trade-off | | | | Yoshita | |

## Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint verified | | | | Chetan/Prashant | |
| Execute Decision button | | | | Yoshita/Chetan | |
| Database INSERT verified | | | | Chetan/Mansi | |

## Week 3 — Closed Loop

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Evaluation script | | | | Chetan/Prashant | |
| Predicted cost comparison | | | | Chetan | |
| Actual historical outcome | | | | Mansi | |
| Discrepancy calculation | | | | Chetan | |
| Decision ROI | | | | Chetan/Prashant | |
| Positive business outcomes | | | | Chetan/Mansi | |
| ROI analytics UI | | | | Yoshita | |

## Week 4 — Continuous Learning & Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | | | | Chetan | |
| Retraining trigger | | | | Chetan | |
| XGBoost retraining workflow | | | | Chetan | |
| Final analyst workflow polish | | | | Yoshita | |

## Final Workflow

| Requirement | Evidence | Status |
|---|---|---|
| Analyst reviews prediction | | |
| Analyst reviews recommendations | | |
| Analyst compares Cost vs Speed | | |
| Analyst participates in decision | | |
| Analyst executes decision | | |
| Decision written to database | | |
| Actual outcome used for evaluation | | |
| Evaluation feeds back into learning | | |

## Final Review Checklist

- [ ] Every PDF requirement has an owner.
- [ ] Every requirement has an implementation location.
- [ ] Every completed requirement has actual test evidence.
- [ ] Every demo requirement has a demonstrable UI/API workflow.
- [ ] No fabricated results are used.
- [ ] No placeholder is marked PASS.
- [ ] No requirement is silently omitted.

## Current Critical Gaps

The following requirements cannot be marked complete until actual implementation and verification evidence exists:

1. Predictive model
2. Historical supply-chain dataset
3. Prescriptive optimization
4. Hard constraint validation
5. Operational database write-back
6. Closed-loop evaluation
7. Decision ROI from actual outcomes
8. Continuous learning / XGBoost retraining
9. Final end-to-end workflow verification
