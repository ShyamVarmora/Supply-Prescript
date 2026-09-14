# Supply Prescript

Closed-loop prescriptive analytics project for supply chain operations.

## Team

- Shyam â€” Team Lead, DevOps, Integration , Daliy task provide to each member
- Chetan â€” Backend
- Mansi â€” Database 
- Yoshita â€” UI / Frontend
- Prashant â€” Documentation

## Project Goal

Build a closed-loop system that:

1. Predicts supply-chain disruptions
2. Generates optimized alternative actions
3. Allows an operator to select a recommendation
4. Records the selected decision
5. Evaluates the actual outcome
6. Uses feedback for future optimization/model retraining

## Architecture

User
  â†“
React Frontend
  â†“
FastAPI Backend
  â†“
Prediction Model
  â†“
Prescriptive Optimizer
  â†“
Recommendations
  â†“
Operator Decision
  â†“
Database
  â†“
Actual Outcome
  â†“
Evaluation / Feedback
  â†“
Future Optimization / Retraining

Technology Stack :-

Frontend: React
Backend: FastAPI / Python
Database: PostgreSQL
Predictive Model: XGBoost
Optimization: SciPy
API: REST

Main Modules :- 

1. Prediction

Predicts supply-chain shipment disruption and delay risk from shipment data.

2. Prescriptive Optimization

Generates feasible recommendations using operational constraints such as:

Budget
Time
Capacity
3. Decision Write-Back

The selected recommendation is written back to the operational database.

4. Outcome Evaluation

The actual operational outcome is recorded and compared with the prediction/decision.

5. Feedback Loop

Evaluation results are used to improve future optimization and model behavior.

Repository Structure :- 

Supply-Prescript/
â”‚
â”œâ”€â”€ backend/
â”œâ”€â”€ frontend/
â”œâ”€â”€ database/
â”œâ”€â”€ data/
â”œâ”€â”€ models/
â”œâ”€â”€ docs/
â””â”€â”€ README.md

Current Development Flow :- 

Prediction
   â†“
Recommendation
   â†“
Recommendation Selection
   â†“
Decision Write-Back
   â†“
Outcome Capture
   â†“
Evaluation
   â†“
Feedback

Development Status :- 

Final integrated workflow has been verified with live PostgreSQL, backend APIs, frontend E2E, evaluation, ROI, and retraining evidence.

Current priority:- 

Database Validation
        â†“
Backend Integration
        â†“
Decision API
        â†“
Frontend Decision Integration
        â†“
End-to-End QA
        â†“
Final Documentation

Team Responsibilities :-

Member	Responsibility
Shyam	Team Lead, DevOps, Integration , daliy task provide to each member
Chetan	Backend, APIs, Database Integration
Mansi	Database, Data Validation
Yoshita	UI, Frontend, Frontend API Integration
Prashant	QA, API Testing, Frontend Support, Documentation

Quality Gate :- 

A feature is considered complete only after ;

Code is implemented
Integration is verified
Actual test passes
Database behavior is verified where applicable
Evidence is recorded
Project Objective

The final system must demonstrate the complete closed-loop workflow: -

Predict
  â†“
Recommend
  â†“
Select
  â†“
Write Back
  â†“
Observe Actual Outcome
  â†“
Evaluate
  â†“
Learn


## API Endpoints

- GET /health
- POST /predict/shipment-delay
- POST /recommend
- POST /decisions
- GET /decisions/history
- POST /decisions/{id}/outcome
- GET /decisions/{id}/evaluation
- GET /decisions/analytics/roi

### Final QA ROI Analytics Evidence

- total_decisions: 8
- evaluated_decisions: 8
- positive_outcomes: 5
- negative_outcomes: 3
- positive_outcome_rate: 62.5%
- average_roi: -0.30889857936569803%
- positive outcome definition: actual_cost <= expected_cost
