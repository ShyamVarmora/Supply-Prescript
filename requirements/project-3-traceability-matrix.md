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
| XGBoost predictive baseline | Not verified in the repository evidence reviewed | No actual model test evidence | No model demo evidence | Chetan | NOT STARTED |
| Historical mock supply-chain data | `data/` directory exists; actual dataset implementation not verified | No actual dataset validation evidence | No demo evidence | Mansi | NOT STARTED |
| Shipment-delay prediction | No verified prediction implementation found in the reviewed repository evidence | No prediction test evidence | No prediction demo evidence | Chetan | NOT STARTED |
| React application scaffolding | `frontend/` with Vite/React structure; `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/package.json` | No formal Week 1 application test evidence recorded | React application structure exists; no final demo evidence | Yoshita | IN PROGRESS |
| PostgreSQL / Snowflake connection | `database/` exists but currently only `.gitkeep` was verified; backend currently exposes only `/health` | No actual database connectivity evidence | No database demo evidence | Mansi | BLOCKED |

---

## Week 2 — Optimization & Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Business constraints defined | No verified constraint implementation found in reviewed code | No constraint validation evidence | No demo evidence | Chetan/Mansi | NOT STARTED |
| SciPy linear-programming solver | No verified SciPy solver implementation found in reviewed code | No solver test evidence | No solver demo evidence | Chetan | NOT STARTED |
| Three alternative actions | `frontend/src/App.jsx` contains three recommendation definitions: Expedite Shipment, Use Alternate Supplier, Delay Launch | No verified backend-generated alternatives test | Three UI recommendation cards are implemented in `App.jsx` | Chetan | IN PROGRESS |
| Three prescription cards | `frontend/src/App.jsx` renders three recommendation cards using `recommendations.map(...)` | No completed QA verification evidence | Three recommendation cards are visible in the React implementation | Yoshita | IN PROGRESS |
| Cost displayed | `frontend/src/App.jsx` displays a Cost field, but value is currently `"Backend value"` placeholder | No evidence that real solver cost is displayed | Cost field exists in recommendation cards | Yoshita | IN PROGRESS |
| Speed/time displayed | `frontend/src/App.jsx` displays Speed / Time, but value is currently `"Backend value"` placeholder | No evidence that real solver speed/time is displayed | Speed / Time field exists in recommendation cards | Yoshita | IN PROGRESS |
| Cost vs Speed trade-off | `frontend/src/App.jsx` contains Cost and Speed / Time fields and trade-off wording | No evidence using real optimization results | Trade-off UI structure exists | Yoshita | IN PROGRESS |

---

## Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint verified | No verified hard-budget solver implementation found | No hard-budget validation evidence | No demo evidence | Chetan/Prashant | NOT STARTED |
| Execute Decision button | `frontend/src/App.jsx` contains an Execute Decision button, but it is disabled | No successful execution test evidence | Button exists but is disabled | Yoshita/Chetan | IN PROGRESS |
| Database INSERT verified | `backend/app/main.py` currently exposes only a| Historical mock supply-chain data | | | | Mansi | |
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
