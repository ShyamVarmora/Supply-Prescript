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
| XGBoost predictive baseline | Not implemented in reviewed repository evidence | No actual evidence | No demo evidence | Chetan | NOT STARTED |
| Historical mock supply-chain data | Not verified in reviewed repository evidence | No actual evidence | No demo evidence | Mansi | BLOCKED |
| Shipment-delay prediction | Frontend states that shipment risk information will be provided by the backend model; no predictive model implementation verified | No actual evidence | No real prediction demo | Chetan | NOT STARTED |
| React application scaffolding | `frontend/src/App.jsx` | No dedicated QA evidence yet | React UI implementation present | Yoshita | IN PROGRESS |
| PostgreSQL / Snowflake connection | No database connection implementation verified in reviewed evidence | No actual evidence | No database connection demo | Mansi | NOT STARTED |

---

## Week 2 — Optimization & Prescriptive UI

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Business constraints defined | No verified backend constraint implementation in reviewed evidence | `testing/week-2-test-plan.md` contains required checks only | No verified solver demo | Chetan/Mansi | NOT STARTED |
| SciPy linear-programming solver | No verified SciPy LP implementation in reviewed evidence | `testing/week-2-test-plan.md` contains solver check only | No solver output demo | Chetan | NOT STARTED |
| Three alternative actions | `frontend/src/App.jsx` defines three recommendation objects: Option 1, Option 2, Option 3; values are currently placeholders | `testing/week-2-test-plan.md` contains the three-action requirement | Three recommendation cards are rendered in the frontend | Chetan | IN PROGRESS |
| Three prescription cards | `frontend/src/App.jsx` renders the three recommendations as recommendation cards | `testing/week-2-test-plan.md` contains prescription-card check | Three recommendation cards are visible in the UI | Yoshita | IN PROGRESS |
| Cost displayed | `frontend/src/App.jsx` displays Cost for each recommendation, but current value is `"Backend value"` | `testing/week-2-test-plan.md` contains cost-display check | Cost field is visible in each recommendation card | Yoshita | IN PROGRESS |
| Speed/time displayed | `frontend/src/App.jsx` displays Speed / Time for each recommendation, but current value is `"Backend value"` | `testing/week-2-test-plan.md` contains speed/time check | Speed / Time field is visible in each recommendation card | Yoshita | IN PROGRESS |
| Cost vs Speed trade-off | `frontend/src/App.jsx` contains Cost and Speed / Time fields for each recommendation | `testing/week-2-test-plan.md` contains trade-off check | Cost and Speed / Time are shown together on recommendation cards | Yoshita | IN PROGRESS |

---

## Mid-Project Validation

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Hard budget constraint verified | No verified hard-budget solver validation in reviewed repository evidence | `testing/optimization-audit.md` defines the required audit but does not prove implementation | No verified budget-constraint demo | Chetan/Prashant | NOT STARTED |
| Execute Decision button | `frontend/src/App.jsx` contains an Execute Decision button, but it is disabled because backend/database write-back is unavailable | Week 2 QA plan contains Execute Decision check | Button is visible but not executable | Yoshita/Chetan | IN PROGRESS |
| Database INSERT verified | No verified operational database INSERT implementation in reviewed evidence | No actual INSERT verification evidence | No database write-back demo | Chetan/Mansi | BLOCKED |

---

## Week 3 — Closed Loop

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Evaluation script | No verified closed-loop evaluation implementation in reviewed evidence | `testing/week-3-test-plan.md` defines the required checks | No real evaluation result demo | Chetan/Prashant | NOT STARTED |
| Predicted cost comparison | Frontend displays a Predicted Cost vs Actual Cost section, but real evaluation data is not available | `testing/week-3-test-plan.md` contains predicted-vs-actual check | UI placeholder/empty state only | Chetan | NOT STARTED |
| Actual historical outcome | No verified actual historical outcome retrieval in reviewed evidence | `testing/week-3-test-plan.md` requires actual historical outcome | No actual outcome displayed | Mansi | NOT STARTED |
| Discrepancy calculation | No verified discrepancy calculation implementation | `testing/week-3-test-plan.md` requires discrepancy calculation | No real discrepancy result displayed | Chetan | NOT STARTED |
| Decision ROI | `frontend/src/App.jsx` contains a Decision ROI section and calls `getDecisionROI()`, but no real ROI result is demonstrated | `testing/week-3-test-plan.md` contains Decision ROI checks | ROI section is visible with an empty-state message | Chetan/Prashant | IN PROGRESS |
| Positive business outcomes | Frontend contains a Positive Outcomes field, but no real evaluated outcomes are available | `testing/week-3-test-plan.md` contains positive-outcome checks | UI shows an empty state rather than fabricated results | Chetan/Mansi | NOT STARTED |
| ROI analytics UI | `frontend/src/App.jsx` contains Feedback / Decision ROI, ROI cards, evaluation history and Check Evaluation Data control | `testing/week-3-test-plan.md` contains ROI UI checks | ROI analytics section is visible in the UI | Yoshita | IN PROGRESS |

---

## Week 4 — Continuous Learning & Polish

| PDF Requirement | Implementation | Test Evidence | Demo Evidence | Owner | Status |
|---|---|---|---|---|---|
| Prediction discrepancy detection | No verified implementation in reviewed repository evidence | No actual evidence | No demo evidence | Chetan | NOT STARTED |
| Retraining trigger | No verified implementation in reviewed repository evidence | No actual evidence | No demo evidence | Chetan | NOT STARTED |
| XGBoost retraining workflow | No verified implementation in reviewed repository evidence | No actual evidence | No demo evidence | Chetan | NOT STARTED |
| Final analyst workflow polish | `frontend/src/App.jsx` contains prediction area, recommendation cards, decision section, feedback/ROI section and backend connection section | No final end-to-end QA evidence | Frontend workflow structure is present | Yoshita | IN PROGRESS |

---

## Final Workflow

| Requirement | Evidence | Status |
|---|---|---|
| Analyst reviews prediction | `frontend/src/App.jsx` contains a Shipment Risk section; real backend prediction is not verified | IN PROGRESS |
| Analyst reviews recommendations | `frontend/src/App.jsx` renders three recommendation cards | IN PROGRESS |
| Analyst compares Cost vs Speed | `frontend/src/App.jsx` displays Cost and Speed / Time together on recommendation cards | IN PROGRESS |
| Analyst participates in decision | `frontend/src/App.jsx` allows a recommendation to be selected | IN PROGRESS |
| Analyst executes decision | Execute Decision button exists but is disabled until backend/database write-back is available | IN PROGRESS |
| Decision written to database | No verified database write-back evidence | BLOCKED |
| Actual outcome used for evaluation | No verified actual historical outcome integration | NOT STARTED |
| Evaluation feeds back into learning | No verified closed-loop retraining workflow | NOT STARTED |

---

## Final Review Checklist

- [ ] Every PDF requirement has an owner.
- [x] Every requirement has an implementation location or an explicit statement that it was not verified.
- [ ] Every completed requirement has actual test evidence.
- [ ] Every demo requirement has a demonstrable UI/API workflow.
- [x] No fabricated results are used.
- [x] No placeholder is marked PASS.
- [x] No requirement is silently omitted.

---

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

Documentation alone is not treated as implementation evidence.

---

## Evidence Notes

The current frontend evidence shows the following:

- Three recommendation cards are implemented.
- Each recommendation has an identifiable action.
- Cost is displayed.
- Speed / Time is displayed.
- Cost and Speed / Time are presented together for comparison.
- A recommendation can be selected.
- An Execute Decision button exists, but it is currently disabled.
- The Feedback / Decision ROI section exists.
- Positive Outcomes and Evaluated Decisions are represented in the UI.
- Predicted Cost vs Actual Cost is represented in the UI.
- The UI explicitly shows an empty state when real evaluation data is unavailable.
- The frontend calls backend API functions for backend health and Decision ROI.

These frontend elements do not by themselves prove that the backend solver, database write-back, historical outcomes, closed-loop evaluation, ROI calculation, or XGBoost retraining are implemented.

No PASS status is assigned without actual implementation and verification evidence.
