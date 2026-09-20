# Supply Prescript - Project 3 QA Test Plan

## Current verified release status — 2026-09-20

Current verification on the devops branch is as follows:

- Backend: `python -W error -m pytest -v` → 15 passed, 0 skipped, 0 warnings
- Real PostgreSQL: `RUN_REAL_DB=1 python -W error -m pytest -v` → 2 real DB tests passed, 0 skipped, 0 warnings
- Frontend: `npm run lint` and `npm run build` → passed
- Dependency check: `python -m pip check` → passed
- Repository hygiene: `git diff --check` → passed

Historical dated QA sections remain preserved below for audit continuity only; the active verification status above reflects the current code.

## Historical snapshot — 02/09/2026

> The material below is retained as historical QA evidence. It is not the final integrated status.

## 1. Purpose

This document captures the final QA status for the verified Supply Prescript implementation.

The successful integrated PostgreSQL/browser verification on 12/09/2026 is the historical functional verification baseline. The 17/09/2026 QA-machine rerun was separate and BLOCKED because PostgreSQL was unavailable. The ROI analytics semantic correction and matching unit test were added on 19/09/2026, so current code must be re-tested after that change.

---

## 2. Verified Workflow

The following workflow is verified in the current branch:

- real supply-chain record lookup by record_id
- XGBoost shipment-delay prediction
- SciPy optimization with hard budget, time, and capacity checks
- generation of three alternatives
- selection of a feasible recommendation
- decision write-back into PostgreSQL
- actual outcome capture
- evaluation and ROI calculation
- discrepancy detection and retraining trigger

---

## 3. Automated Verification

### GitHub Actions

- GitHub Actions CI runs `pytest -q` → 12 passed, 2 skipped, 1 warning.

### Local full verification — 12/09/2026

- `$env:RUN_REAL_DB="1"; pytest backend/tests -v` → 14 passed, 0 failed, 0 skipped, 1 warning.

### Real PostgreSQL integration — 12/09/2026

- `$env:RUN_REAL_DB="1"; pytest backend/tests/test_real_postgres.py -v` → 2 passed, 0 failed, 1 warning.

### Frontend

- `npm.cmd --prefix frontend run lint` → passed
- `npm.cmd --prefix frontend run build` → passed

### Repository hygiene

- `git diff --check` → clean (no output)

---

## 4. Required Evidence Rules

- PASS only when actual implementation and execution evidence exist.
- Historical snapshots remain valid only as historical development records.
- Active final status is the successful 12/09/2026 integrated verification.
- The 17/09/2026 PostgreSQL BLOCKED result is recorded separately as an environment-only rerun and does not replace the integrated result.

---

## 5. Overall Final Test Status

**Verified integrated status — 12/09/2026**

The integrated PostgreSQL-backed workflow was successfully verified on 12/09/2026 with backend API execution, real PostgreSQL decision write-back, actual outcome capture, evaluation, discrepancy detection, discrepancy-triggered XGBoost retraining, and frontend lint/build checks. The real PostgreSQL tests create and clean up temporary records, so this document does not claim a persistent decision ID or database count.

---

## 6. Final Verification Notes — QA-machine rerun 17/09/2026

Historical planning and verification material above is retained for audit continuity. The 17/09/2026 results below are environment-only rerun results and do not replace the successful 12/09/2026 integrated verification.

### Current final-QA results

Direct POST /predict/shipment-delay → HTTP 200; predicted_delivery_time_deviation = 5.67630672454834.
pytest backend/tests -v -W always → 12 passed, 2 skipped, 1 warning in 12.37s.
Real PostgreSQL rerun → BLOCKED because localhost:5432 is unavailable on this PC; no current 2 passed claim is made.
npm.cmd --prefix frontend run lint → PASS.
npm.cmd --prefix frontend run build → PASS; 19 modules transformed.
git diff --check → clean.

Historical live-PostgreSQL evidence remains preserved separately and is not represented as the current local database state.

### Scope

This historical section does not include the later 19/09/2026 ROI analytics semantic correction and matching unit test. Current-code verification after that change is tracked separately from this historical QA-machine rerun.

### Exact warning captured

Current backend warning:

`DeprecationWarning: The anyio.abc.BlockingPortal alias is deprecated, use anyio.from_thread.BlockingPortal instead.`

Source: `starlette/testclient.py:53`.

Current backend result: `12 passed, 2 skipped, 1 warning in 12.37s`.

Current real-PostgreSQL rerun: `BLOCKED — 2 tests collected; first test reached the PostgreSQL connection and the run ended with KeyboardInterrupt after 34.96s.`

No `httpx2` → `httpx` dependency rename was made.
