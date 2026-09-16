# Supply Prescript — Week 3 Evaluation Evidence

## Scope

Final Week 3 evaluation evidence for the integrated `devops` implementation.

The evaluation module compares stored expected/predicted cost with the recorded actual outcome for an executed decision.

## Verified Decision

Decision 50 was executed for record 1 and linked to recommendation 109 (`Air Freight`).

Outcome 44 recorded:

- actual cost: `600`
- actual delay: `6`
- status: `completed`

## Evaluation Result

```text
status = discrepancy_detected
predicted_cost = 684.7557795
actual_cost = 600
absolute_difference = 84.75577950000002
percentage_difference = 14.125963250000003
threshold = 10
roi_percent = 12.377519407267744
```

## ROI Analytics

Positive outcome definition:

`actual_cost <= expected_cost`

Latest verified analytics:

- total decisions: 8
- evaluated decisions: 8
- positive outcomes: 5
- negative outcomes: 3
- positive outcome rate: 62.5%
- average ROI: -0.30889857936569803%

## Missing Actual Handling

The automated evaluation workflow includes a pending/incomplete path when an actual outcome is unavailable. This remains part of the evaluated behavior and is not used to fabricate an outcome.

## Closed-Loop Discrepancy-Triggered Retraining

Decision 50 has a populated `retraining_triggered_at` value in `decision_log`. The updated model artifact checksum and timestamp are recorded in final QA evidence.

## Final Status

**PASS - Week 3 evaluation, ROI and feedback evidence synchronized with the final Project 3 state.**
