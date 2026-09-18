# Week 3 Frontend Integration Evidence

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

**Date:** 02/09/2026
**Branch:** ui

## Test Results

| Test                         | Expected Result                                          | Actual Result                                | Status           |
| ---------------------------- | -------------------------------------------------------- | -------------------------------------------- | ---------------- |
| Frontend build               | `npm run build` completes successfully                   | Vite production build completed successfully | PASS             |
| Git diff check               | No whitespace errors                                     | `git diff --check` produced no output        | PASS             |
| Backend health API           | Backend returns a successful response                    | `GET /health` returned `{"status":"ok"}`     | PASS             |
| Prediction API | Valid request returns prediction data | Direct backend prediction was verified; browser frontend request was blocked by CORS during live integration | Historical — IN PROGRESS (02/09/2026) |
| Recommendation API | Valid request returns optimization results | Direct backend /recommend execution was verified; browser frontend request was blocked by CORS during live integration | Historical — IN PROGRESS (02/09/2026) |
| Recommendation cards | Cards display actual backend alternatives | RecommendationCard UI structure exists, but live backend-backed card rendering was not verified because browser request was blocked by CORS | Historical — IN PROGRESS (02/09/2026) |
| Recommendation selection | Selected card is visibly identified | Frontend selection logic exists, but live backend-backed selection flow was not verified | Historical — IN PROGRESS (02/09/2026) |
| Decision display | Selected recommendation updates Decision section | Frontend decision-display logic exists, but live backend-backed update was not verified | Historical — IN PROGRESS (02/09/2026) |
| Execute Decision             | Button remains disabled until write-back endpoint exists | Button remained disabled; no decision write-back was attempted | PASS |
| Invalid input handling       | Controlled error is displayed                            | Invalid input produced a controlled error without fake recommendation data | PASS |
| Backend unavailable handling | Controlled error is displayed                            | Backend-unavailable state produced a controlled load error | PASS |
| No feasible solution         | Empty state is displayed without fake data               | No-feasible-solution case was handled without fake recommendation data | PASS |
| Responsive layout            | UI remains usable on narrow screens                      | UI remained usable at narrow/mobile viewport | PASS |

## Build Evidence

Command:

`npm --prefix frontend run build`

Result:

`built successfully`

## Git Diff Check

Command:

`git diff --check`

Result:

No output, indicating no whitespace errors.

## Backend Health Evidence

Command:

`curl http://127.0.0.1:8000/health`

Result:

`{"status":"ok"}`

## Notes

Historical 02/09/2026 state: the decision write-back endpoint was not available yet; Execute Decision remained disabled and no fake execution success was displayed.

Backend files used for local integration testing must not be included in the frontend UI commit.

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
- Current local PostgreSQL integration rerun: BLOCKED because localhost:5432 is unavailable on this PC; the latest run ended with KeyboardInterrupt after 34.96s and no PostgreSQL test passed.
- Frontend lint: PASS.
- Frontend build: PASS; 19 modules transformed.
- git diff --check: clean.
- Historical live-PostgreSQL evidence remains preserved in the document above.
