# Supply Prescript

## Closed-Loop Prescriptive Analytics for Supply Chain Operations

Supply Prescript is a closed-loop prescriptive analytics system designed for supply-chain operations.

The system goes beyond predicting that a disruption may occur. It uses the prediction to generate constrained business actions, allows an operator to select and execute a recommendation, records the operational decision, evaluates the real outcome, and feeds the evaluation back into the learning cycle.

---

## 1. Problem Statement

Traditional predictive analytics can identify a future supply-chain disruption, but prediction alone does not tell an operator what action should be taken.

Supply Prescript addresses this gap by connecting:

**Prediction → Optimization → Decision → Write-Back → Outcome → Evaluation → Feedback**

The objective is to turn a predicted supply-chain disruption into an actionable and measurable operational decision.

---

## 2. Project Objective

The system is designed to:

1. Predict supply-chain shipment disruption or delay.
2. Use mathematical optimization to generate feasible alternative actions.
3. Enforce business constraints such as Budget, Time, and Capacity.
4. Present the best available alternatives to the operator.
5. Allow the operator to select a feasible recommendation.
6. Write the selected decision into the operational database.
7. Capture the actual operational outcome.
8. Compare predicted/expected results with the actual outcome.
9. Measure Decision ROI and decision effectiveness.
10. Use detected discrepancies as feedback for future model retraining and optimization improvement.

---

## 3. End-to-End Workflow

Historical Supply-Chain Data
            │
            ▼
      Predictive Model
        (XGBoost)
            │
            ▼
   Predicted Shipment Risk
            │
            ▼
 Prescriptive Optimization
          (SciPy)
            │
            ▼
   Feasible Alternatives
      ┌─────┼─────┐
      ▼     ▼     ▼
   Option 1  Option 2  Option 3
      │     │     │
      └─────┼─────┘
            ▼
       Operator Selects
       a Recommendation
            │
            ▼
     Execute Decision
            │
            ▼
     PostgreSQL Database
            │
            ▼
      Actual Outcome
            │
            ▼
     Decision Evaluation
            │
            ▼
       Decision ROI
            │
            ▼
   Discrepancy Detection
            │
            ▼
     Model Retraining
            │
            └──────────────► Future Decisions

---

## 4. Architecture
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│ Shipment / Recommendations   │
│ Decision Execution            │
│ Outcome Capture               │
│ Evaluation / History          │
└──────────────┬───────────────┘
               │ REST API
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│                              │
│ Prediction                   │
│ Recommendation Generation    │
│ Decision Write-Back           │
│ Outcome Capture              │
│ Evaluation                   │
│ Retraining Trigger           │
└───────┬───────────┬──────────┘
        │           │
        ▼           ▼
┌──────────────┐ ┌──────────────────────┐
│    XGBoost   │ │        SciPy         │
│  Prediction  │ │ Prescriptive Solver │
└──────────────┘ └──────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│         PostgreSQL           │
│                              │
│ supply_chain_data            │
│ predictions                  │
│ prescriptive_recommendations │
│ decision_log                 │
│ actual_outcomes              │
└──────────────────────────────┘

---

## 5. Core Modules

5.1 Predictive Model :- 

The predictive layer uses XGBoost to estimate shipment disruption / delivery-time deviation from historical supply-chain information.

The prediction layer is separated from the prescriptive optimization layer so that predicted operational risk can be used as an input to decision optimization.

5.2 Prescriptive Optimization :- 

The optimization layer uses SciPy to generate alternative actions under operational constraints.

The optimization problem considers constraints including:

Budget
Allowed Time
Available Capacity
Shipment Time
Shipment Capacity

The output contains alternative actions together with feasibility information.

A recommendation is only executable when the required constraints are satisfied.

5.3 Decision Write-Back :- 

After reviewing the recommendations, the operator can select a feasible action.

The selected decision is sent to the FastAPI backend and persisted in PostgreSQL.

The write-back layer connects the analytical recommendation with the operational decision record.

5.4 Outcome Capture :- 

After a decision has been executed operationally, the actual outcome can be recorded.

Relevant outcome information includes:

Actual Cost
Actual Delay
Outcome Status

This creates the historical record required for closed-loop evaluation.

5.5 Decision Evaluation :-

The evaluation layer compares the expected/predicted decision result with the actual recorded outcome.

This allows the system to identify whether the decision performed as expected and whether a significant discrepancy occurred.

5.6 Decision ROI :- 

Decision ROI provides a business-oriented view of decision effectiveness.

The evaluation layer provides the basis for determining whether an executed recommendation produced a positive or negative operational outcome.

The exact ROI calculation and reporting rules are maintained with the evaluation implementation and test evidence rather than being hard-coded into the README.

5.7 Feedback and Retraining :-

The final stage of the closed loop is feedback.

When evaluation identifies a meaningful discrepancy between expected and actual results, the system can trigger model retraining.

This creates the intended learning cycle:

Decision
   ↓
Actual Outcome
   ↓
Evaluation
   ↓
Discrepancy Detection
   ↓
Retraining
   ↓
Updated Model

---

## 6. API Layer

The backend exposes REST endpoints for the main system workflow.

Health
GET /health

Used to verify that the API service is available.

Shipment Delay Prediction
POST /predict/shipment-delay

Runs shipment-delay prediction using the predictive model.

Recommendation Generation
POST /recommend

Validates a supply-chain record, obtains the required shipment data, runs prediction, executes the constrained optimization process, stores generated recommendations, and returns the recommendation set.

Decision Write-Back
POST /decisions

Validates the selected recommendation and writes the operational decision to the database.

Decision History
GET /decisions/history

Returns previously recorded decisions.

Actual Outcome
POST /decisions/{decision_id}/outcome

Records the actual outcome for an executed decision.

Decision Evaluation
GET /decisions/{decision_id}/evaluation

Evaluates the executed decision against the recorded actual outcome and supports discrepancy-driven feedback.

---

## 7. Data Layer

The project uses PostgreSQL for the operational and analytical workflow.

Main Tables

| Table                          | Purpose                             |
| ------------------------------ | ----------------------------------- |
| `supply_chain_data`            | Source supply-chain records         |
| `predictions`                  | Prediction records                  |
| `prescriptive_recommendations` | Generated optimization alternatives |
| `decision_log`                 | Operator-selected decisions         |
| `actual_outcomes`              | Actual operational outcomes         |

The database schema is maintained in:

database/schema.sql

---

## 8. Technology Stack

| Layer           | Technology      |
| --------------- | --------------- |
| Frontend        | React           |
| Backend         | FastAPI         |
| Language        | Python          |
| Database        | PostgreSQL      |
| Prediction      | XGBoost         |
| Optimization    | SciPy           |
| API             | REST            |
| Data Processing | Python / Pandas |
| Testing         | Pytest          |

---

## 9. Repository Structure

Supply-Prescript/
│
├── backend/
│   ├── app/
│   │   └── main.py
│   │
│   ├── ml/
│   │   ├── train.py
│   │   ├── predict.py
│   │   ├── optimizer.py
│   │   ├── evaluate.py
│   │   └── MODEL_CONTRACT.md
│   │
│   ├── tests/
│   │   ├── test_decisions.py
│   │   ├── test_workflows.py
│   │   └── test_real_postgres.py
│   │
│   └── requirements.txt
│
├── database/
│   └── schema.sql
│
├── data/
│   ├── raw/
│   └── processed/
│
├── frontend/
│
├── models/
│
├── testing/
│
├── Decisions/
│
└── README.md

---

## 10. Constraint Handling

The prescriptive layer is designed around explicit operational constraints.

Budget

A recommendation must remain within the configured maximum budget.

Time

A recommendation must satisfy the allowed operational time.

Capacity

A recommendation must satisfy the available capacity requirement.

Feasibility

Each generated alternative exposes its constraint-validation state.

Only recommendations satisfying the required constraints are eligible for decision execution.

---

## 11. Closed-Loop Decision Model

The system follows a complete operational decision cycle:

1. Predict
      ↓
2. Recommend
      ↓
3. Validate Constraints
      ↓
4. Select
      ↓
5. Execute
      ↓
6. Write Back
      ↓
7. Observe Actual Outcome
      ↓
8. Evaluate
      ↓
9. Measure Decision ROI
      ↓
10. Detect Discrepancy
      ↓
11. Retrain
      ↓
12. Improve Future Decisions

The purpose of the architecture is not simply to display analytics.

The system is designed to connect an AI recommendation directly to an operational decision and then measure what happened afterward.

---

## 12. Quality Gate

A feature should be considered complete only when the following conditions are satisfied:

Implementation
      +
Integration
      +
Actual Execution
      +
Database Verification
      +
Test Evidence
      +
Documentation

Code existing in the repository alone is not treated as proof of successful end-to-end operation.

Database-dependent behavior must be verified against the actual PostgreSQL environment.

Final project claims must be supported by reproducible test or execution evidence.

---

## 13. Verification Philosophy

Supply Prescript follows an evidence-based validation approach.

Important checks include:

Predictive model execution
Optimization feasibility
Budget constraint enforcement
Time constraint enforcement
Capacity constraint enforcement
Recommendation persistence
Decision write-back
Actual outcome persistence
Decision evaluation
Decision ROI calculation
Decision history
Discrepancy detection
Model retraining
Frontend-to-backend integration
End-to-end workflow execution

A feature is not considered fully verified solely because its source code exists.

---

## 14. Design Principles

No Fake Operational Data

Operational outputs should originate from the actual system workflow rather than static UI placeholders.

Constraint-First Decisions

The optimizer must respect the defined operational constraints before a recommendation becomes executable.

Traceable Decisions

A selected recommendation must be connected to its originating supply-chain record and stored decision record.

Closed-Loop Measurement

An executed decision must be capable of being evaluated against its actual outcome.

Evidence-Based Completion

Implementation status should be supported by test results, database verification, or reproducible execution evidence.

Separation of Responsibilities

Prediction, optimization, operational write-back, evaluation, and feedback are kept as distinct stages of the system.

--- 

## 15. Project Outcome

Supply Prescript is intended to demonstrate a complete prescriptive analytics workflow for supply-chain operations:

Predict the disruption
        ↓
Determine what to do
        ↓
Respect business constraints
        ↓
Present alternatives
        ↓
Execute the selected decision
        ↓
Record the operational result
        ↓
Measure decision effectiveness
        ↓
Learn from discrepancies

This architecture transforms predictive analytics from a passive reporting system into an operational decision-support workflow.

---

## 16. Reference Architecture

The implementation follows the Project 3 development requirements:

Predictive baseline using XGBoost
Custom React operational interface
PostgreSQL operational database architecture
SciPy-based constrained optimization
Three alternative recommendations
Cost versus Speed trade-off presentation
Hard constraint validation
Execute Decision write-back
Historical outcome evaluation
Decision ROI
Feedback-driven XGBoost retraining
End-to-end operational workflow

The repository implementation should remain aligned with the actual verified system rather than claiming capabilities that have not been demonstrated.