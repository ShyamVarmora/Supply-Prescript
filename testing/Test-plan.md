# Supply Prescript — Project 3 QA Test Plan

## 1. Purpose

This document records the final QA checks for the integrated Project 3 workflow on the current `devops` implementation.

Final QA covers XGBoost prediction, SciPy optimization, PostgreSQL persistence, decision execution, actual outcome capture, evaluation, Decision ROI, discrepancy-triggered retraining, and the React/FastAPI browser workflow.

PASS is used only where implementation and actual execution evidence support the requirement.

## 2. Predictive Model

### Historical Supply-Chain Data

- Historical CSV dataset verified: 113097 rows and 18 columns.
- Real supply-chain record ID 1 was used in the final E2E flow.

### Predictive Model

- XGBoost model artifact loaded successfully.
- Shipment-delay prediction was generated through the live recommendation workflow.
- Prediction persistence was verified in PostgreSQL `predictions`.

**Status: PASS**

## 3. Prescriptive Solver

- SciPy optimization executed successfully.
- Exactly three alternatives were generated: Air Freight, Secondary Supplier, Delay Launch.
- Budget, time, and capacity feasibility were enforced.
- Hard budget case with budget 40 produced no feasible alternative.
- Restrictive time and capacity cases were covered by optimizer tests.
- Infeasible recommendations are not eligible for execution.

**Status: PASS**

## 4. Operational UI

The final browser workflow completed:

`Record → Generate → Prediction → 3 Alternatives → Select Feasible Alternative → Execute Decision → Decision ID → Actual Outcome → Evaluation → ROI → History → ROI Analytics`

Frontend lint and production build both passed.

**Status: PASS**

## 5. Write-Back

Final write-back evidence includes:

- Decision 50 persisted in `decision_log`.
- Outcome 44 persisted in `actual_outcomes`.
- Decision history returned stored decision/outcome/evaluation data.

**Status: PASS**

## 6. Closed-Loop Evaluation

Decision 50 was evaluated using stored expected/predicted cost and actual outcome.

- Predicted cost: 684.7557795
- Actual cost: 600
- Absolute difference: 84.75577950000002
- Percentage difference: 14.125963250000003%
- Threshold: 10%
- Evaluation status: `discrepancy_detected`

**Status: PASS**

## 7. Decision ROI

Decision 50 ROI was calculated from the stored decision/outcome data.

- ROI: 12.377519407267744%
- Positive outcome definition: `actual_cost <= expected_cost`
- Latest analytics: 8 total/evaluated decisions, 5 positive, 3 negative, 62.5% positive rate, average ROI -0.30889857936569803%.

**Status: PASS**

## 8. Closed-Loop Discrepancy-Triggered Retraining

- Prediction discrepancy detection was verified.
- Decision 50 has a populated `retraining_triggered_at` timestamp in `decision_log`.
- Updated XGBoost model artifact metadata was captured in final QA evidence.

**Status: PASS**

## 9. Database Connectivity

PostgreSQL was connected successfully using database `supply_prescript_db`.

Required tables verified:

1. `supply_chain_data`
2. `predictions`
3. `prescriptive_recommendations`
4. `decision_log`
5. `actual_outcomes`

Real PostgreSQL test records were used for the final E2E workflow.

**Status: PASS**

## 10. Final Analyst Workflow

The final browser run verified prediction review, recommendation review, feasible selection, decision execution, outcome capture, evaluation, ROI, history, and ROI analytics without a workflow-blocking CORS/API failure.

**Status: PASS**

## 11. Final Automated QA Evidence

```text
pytest backend/tests -v
14 passed, 1 warning

RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v
2 passed, 1 warning

npm.cmd --prefix frontend run lint
PASS

npm.cmd --prefix frontend run build
PASS; Vite 8.2.1; 19 modules transformed

git diff --check
PASS; no actual whitespace errors; Windows LF/CRLF conversion warning observed
```

## 12. SQL Database Verification Evidence

### Required table verification

Query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('supply_chain_data','predictions','prescriptive_recommendations','decision_log','actual_outcomes')
ORDER BY table_name;
```

Actual output:

```text
actual_outcomes
decision_log
predictions
prescriptive_recommendations
supply_chain_data
```

### Real record verification

Query:

```sql
SELECT record_id FROM supply_chain_data
WHERE record_id IN (1,2,3)
ORDER BY record_id;
```

Actual output:

```text
1
2
3
```

### Decision verification

Query:

```sql
SELECT decision_id, record_id, recommendation_id, selected_action, expected_cost, decision_status, retraining_triggered_at
FROM decision_log WHERE decision_id = 50;
```

Actual output:

```text
decision_id=50 | record_id=1 | recommendation_id=109 | Air Freight | 684.7557795 | SELECTED | 2026-09-14 23:30:59.769236+05:30
```

### Outcome verification

Query:

```sql
SELECT outcome_id, decision_id, actual_cost, actual_delay_days, outcome_status
FROM actual_outcomes WHERE decision_id = 50;
```

Actual output:

```text
outcome_id=44 | decision_id=50 | actual_cost=600 | actual_delay_days=6 | completed
```

## 13. Overall Final Status

**Current Status: FINAL QA VERIFIED FOR THE INTEGRATED PROJECT 3 WORKFLOW**

All final PASS statements above are based on actual execution evidence. Historical CSV size is explicitly distinguished from operational PostgreSQL test data.
