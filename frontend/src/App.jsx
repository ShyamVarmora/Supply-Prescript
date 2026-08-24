import { useState } from "react";
import { checkBackendHealth, getDecisionROI } from "./services/api";
import "./App.css";

const recommendations = [
  {
    id: 1,
    option: "Option 1",
    action: "Expedite Shipment",
    cost: "Backend value",
    speed: "Backend value",
    reason: "Fastest available response for the shipment risk.",
  },
  {
    id: 2,
    option: "Option 2",
    action: "Use Alternate Supplier",
    cost: "Backend value",
    speed: "Backend value",
    reason: "Provides an alternative supply route to reduce disruption.",
  },
  {
    id: 3,
    option: "Option 3",
    action: "Delay Launch",
    cost: "Backend value",
    speed: "Backend value",
    reason: "Reduces immediate supply pressure while the situation is resolved.",
  },
];

function App() {
  const [backendStatus, setBackendStatus] = useState("Not checked");
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [roiStatus, setRoiStatus] = useState(
    "No evaluation data available yet"
  );

  const testBackendConnection = async () => {
    setBackendStatus("Checking...");

    try {
      const result = await checkBackendHealth();

      if (result.status === "ok") {
        setBackendStatus("Backend connected");
      } else {
        setBackendStatus("Unexpected backend response");
      }
    } catch (error) {
      setBackendStatus("Backend unavailable");
    }
  };

  const handleSelect = (recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const loadDecisionROI = async () => {
    try {
      const result = await getDecisionROI();

      if (result) {
        setRoiStatus("Evaluation data available");
      } else {
        setRoiStatus("No evaluation data available yet");
      }
    } catch (error) {
      setRoiStatus("No evaluation data available yet");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Supply Prescript</h1>
        <p>Supply chain decision support</p>
      </header>

      <main className="app-content">
        <section className="section">
          <h2>Shipment Risk</h2>
          <p className="section-description">
            Shipment risk information will be provided by the backend model.
          </p>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Recommendations</h2>
              <p className="section-description">
                Compare available actions by cost and speed.
              </p>
            </div>
          </div>

          <div className="recommendation-grid">
            {recommendations.map((recommendation) => (
              <article
                key={recommendation.id}
                className={`recommendation-card ${
                  selectedRecommendation?.id === recommendation.id
                    ? "selected"
                    : ""
                }`}
              >
                <div className="card-header">
                  <span className="option-label">
                    {recommendation.option}
                  </span>

                  {selectedRecommendation?.id === recommendation.id && (
                    <span className="selected-badge">Selected</span>
                  )}
                </div>

                <h3>{recommendation.action}</h3>

                <div className="tradeoff">
                  <div className="tradeoff-item">
                    <span>Cost</span>
                    <strong>{recommendation.cost}</strong>
                  </div>

                  <div className="tradeoff-item">
                    <span>Speed / Time</span>
                    <strong>{recommendation.speed}</strong>
                  </div>
                </div>

                <div className="reason">
                  <span>Reason / Expected Outcome</span>
                  <p>{recommendation.reason}</p>
                </div>

                <button
                  type="button"
                  className="select-button"
                  onClick={() => handleSelect(recommendation)}
                >
                  {selectedRecommendation?.id === recommendation.id
                    ? "Selected"
                    : "Select Recommendation"}
                </button>
              </article>
            ))}
          </div>

          <p className="data-note">
            Cost and speed values are placeholders until the backend solver
            provides real prescription output.
          </p>
        </section>

        <section className="section">
          <h2>Decision</h2>

          {selectedRecommendation ? (
            <div className="decision-panel">
              <div>
                <span className="decision-label">
                  Selected Recommendation
                </span>

                <h3>{selectedRecommendation.action}</h3>

                <p>{selectedRecommendation.reason}</p>
              </div>

              <button
                type="button"
                className="execute-button"
                disabled
              >
                Execute Decision
              </button>

              <p className="decision-note">
                Decision execution will be enabled when the backend/database
                write-back endpoint is available.
              </p>
            </div>
          ) : (
            <p className="section-description">
              Select a recommendation to prepare the decision.
            </p>
          )}
        </section>

        <section className="section">
          <h2>Feedback / Decision ROI</h2>

          <div className="roi-grid">
            <article className="roi-card">
              <span>Decision ROI</span>
              <strong>No evaluation data available yet</strong>
            </article>

            <article className="roi-card">
              <span>Positive Outcomes</span>
              <strong>No evaluation data available yet</strong>
            </article>

            <article className="roi-card">
              <span>Evaluated Decisions</span>
              <strong>No evaluation data available yet</strong>
            </article>

            <article className="roi-card">
              <span>Predicted Cost vs Actual Cost</span>
              <strong>No evaluation data available yet</strong>
            </article>
          </div>

          <div className="evaluation-history">
            <div className="evaluation-heading">
              <div>
                <h3>Evaluation History</h3>
                <p className="section-description">
                  Decision evaluation results will appear here when backend
                  evaluation data becomes available.
                </p>
              </div>

              <span className="roi-status">{roiStatus}</span>
            </div>

            <div className="evaluation-table">
              <div className="evaluation-row evaluation-header">
                <span>Decision</span>
                <span>Predicted Cost</span>
                <span>Actual Cost</span>
                <span>Outcome</span>
              </div>

              <div className="evaluation-empty">
                Evaluation results will appear after operational decisions
                have been recorded and actual outcomes are available.
              </div>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadDecisionROI}
            >
              Check Evaluation Data
            </button>
          </div>
        </section>

        <section className="section">
          <h2>Backend Connection</h2>

          <div className="backend-status">
            <span>Status</span>
            <strong>{backendStatus}</strong>
          </div>

          <button
            type="button"
            className="backend-button"
            onClick={testBackendConnection}
          >
            Test Backend Connection
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;