# Supply Prescript — Week 3 Evidence Matrix

## Purpose

This document maps the Week 3 requirements to the final verified state of the integrated `devops` implementation.

PASS is used only where implementation and actual execution evidence support the requirement.

## 1. Closed-Loop Evaluation

| Requirement | Actual Evidence | Status |
|---|---|---|
| Recorded decision identified | Decision 50 linked to record 1 and recommendation 109 | PASS |
| Predicted cost available | Decision 50 expected/predicted cost = 684.7557795 | PASS |
| Actual outcome available | Outcome 44 linked to Decision 50; actual cost 600, delay 6, completed | PASS |
| Predicted vs actual comparison | Difference and percentage calculated for Decision 50 | PASS |
| Discrepancy calculation | 14.125963250000003% vs 10% threshold; `discrepancy_detected` | PASS |
| Evaluation retrievable | Evaluation/history data returned for Decision 50 | PASS |
| Real evidence | API/browser result plus `decision_log` and `actual_outcomes` SQL evidence | PASS |

## 2. Decision ROI

| Requirement | Actual Evidence | Status |
|---|---|---|
| ROI calculated from real evaluated decisions | Decision 50 ROI = 12.377519407267744% | PASS |
| Positive outcomes tracked | Latest analytics: 5 positive, 3 negative | PASS |
| Total evaluated decisions counted | Latest analytics: 8 evaluated | PASS |
| ROI displayed/retrievable | Decision evaluation and ROI analytics endpoint returned ROI data | PASS |
| ROI traceable to decision/outcome | Decision 50 and Outcome 44 are linked in stored evidence | PASS |
| No fabricated ROI | Values come from stored backend evaluation/analytics evidence | PASS |

## 3. Operational Database Evidence

PostgreSQL database: `supply_prescript_db`

Required tables verified:

1. `supply_chain_data`
2. `predictions`
3. `prescriptive_recommendations`
4. `decision_log`
5. `actual_outcomes`

Historical dataset volume is separately documented as **113097 rows in the CSV**. It is not represented as the PostgreSQL operational row count.

### SQL table verification

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

### SQL record verification

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

## 4. Decision / Outcome Evidence

Decision 50:

```text
decision_id=50
record_id=1
recommendation_id=109
selected_action=Air Freight
expected_cost=684.7557795
decision_status=SELECTED
```

Outcome 44:

```text
outcome_id=44
decision_id=50
actual_cost=600
actual_delay_days=6
outcome_status=completed
```

## 5. Current Dependency Status

| Dependency | Status |
|---|---|
| Historical dataset | PASS |
| Predictive model | PASS |
| Prescriptive solver | PASS |
| PostgreSQL operational test database | PASS |
| Prediction persistence | PASS |
| Decision write-back | PASS |
| Actual outcome capture | PASS |
| Closed-loop evaluation | PASS |
| Decision ROI | PASS |
| Feedback analytics | PASS |
| Closed-loop discrepancy-triggered retraining | PASS |

## 6. Final Verification Status

The Week 3 workflow is verified against the current integrated state:

`Decision → Actual Outcome → Evaluation → ROI → History → ROI Analytics`

The final browser workflow also completed the preceding recommendation and execution stages.

**Status: PASS**

## Final Automated QA Reference

```text
pytest backend/tests -v
14 passed

RUN_REAL_DB=1 pytest backend/tests/test_real_postgres.py -v
2 passed, 1 warning

npm.cmd --prefix frontend run lint
PASS

npm.cmd --prefix frontend run build
PASS; Vite 8.2.1; 19 modules transformed
```
