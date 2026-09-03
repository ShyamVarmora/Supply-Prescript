# Supply Prescript

Closed-loop prescriptive analytics project for supply chain operations.

## Team

- Shyam — Team Lead, DevOps, Integration , Daliy task provide to each member
- Chetan — Backend
- Mansi — Database 
- Yoshita — UI / Frontend
- Prashant — Documentation

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
  ↓
React Frontend
  ↓
FastAPI Backend
  ↓
Prediction Model
  ↓
Prescriptive Optimizer
  ↓
Recommendations
  ↓
Operator Decision
  ↓
Database
  ↓
Actual Outcome
  ↓
Evaluation / Feedback
  ↓
Future Optimization / Retraining

Technology Stack :-

Frontend: React
Backend: FastAPI / Python
Database: MySQL
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
│
├── backend/
├── frontend/
├── database/
├── data/
├── models/
├── docs/
└── README.md

Current Development Flow :- 

Prediction
   ↓
Recommendation
   ↓
Recommendation Selection
   ↓
Decision Write-Back
   ↓
Outcome Capture
   ↓
Evaluation
   ↓
Feedback

Development Status :- 

The project is being completed in integration stages.

Current priority:- 

Database Validation
        ↓
Backend Integration
        ↓
Decision API
        ↓
Frontend Decision Integration
        ↓
End-to-End QA
        ↓
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
  ↓
Recommend
  ↓
Select
  ↓
Write Back
  ↓
Observe Actual Outcome
  ↓
Evaluate
  ↓
Learn
