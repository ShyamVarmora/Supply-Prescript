import { useEffect, useState } from "react";
import {
  checkBackendHealth,
  getDecisionROI,
  getPredictionRecommendations,
} from "./services/api";
import RecommendationCard from "./components/RecommendationCard";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Not checked");

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] =
    useState(true);
  const [recommendationsError, setRecommendationsError] =
    useState(false);

  const [selectedRecommendation, setSelectedRecommendation] =
    useState(null);

  const [roiStatus, setRoiStatus] = useState(
    "No evaluation data available yet"
  );

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setRecommendationsLoading(true);
    setRecommendationsError(false);

    try {
      const result = await getPredictionRecommendations();

      if (Array.isArray(result)) {
        setRecommendations(result);
      } else if (result?.recommendations) {
        setRecommendations(result.recommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      setRecommendations([]);
      setRecommendationsError(true);
    } finally {
      setRecommendationsLoading(false);
    }
  };

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

          {recommendationsLoading ? (
            <div className="recommendation-state">
              Loading recommendations...
            </div>
          ) : recommendationsError ? (
            <div className="recommendation-state error">
              Unable to load recommendations.
            </div>
          ) : recommendations.length === 0 ? (
            <div className="recommendation-state">
              No recommendations available yet.
            </div>
          ) : (
            <div className="recommendation-grid">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={
                    recommendation.id ??
                    recommendation.option ??
                    index
                  }
                  recommendation={recommendation}
                  selected={
                    selectedRecommendation?.id ===
                      recommendation.id ||
                    selectedRecommendation?.option ===
                      recommendation.option
                  }
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
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

                <p>
                  {selectedRecommendation.reason}
                </p>

                <div className="decision-details">
                  <span>
                    Cost:{" "}
                    {selectedRecommendation.cost}
                  </span>

                  <span>
                    Speed / Time:{" "}
                    {selectedRecommendation.speed}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="execute-button"
                disabled
              >
                Execute Decision
              </button>

              <p className="decision-note">
                Decision execution will be enabled when the
                backend/database write-back endpoint is available.
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
              <strong>
                No evaluation data available yet
              </strong>
            </article>

            <article className="roi-card">
              <span>Positive Outcomes</span>
              <strong>
                No evaluation data available yet
              </strong>
            </article>

            <article className="roi-card">
              <span>Evaluated Decisions</span>
              <strong>
                No evaluation data available yet
              </strong>
            </article>

            <article className="roi-card">
              <span>Predicted Cost vs Actual Cost</span>
              <strong>
                No evaluation data available yet
              </strong>
            </article>
          </div>

          <div className="evaluation-history">
            <div className="evaluation-heading">
              <div>
                <h3>Evaluation History</h3>

                <p className="section-description">
                  Decision evaluation results will appear here
                  when backend evaluation data becomes available.
                </p>
              </div>

              <span className="roi-status">
                {roiStatus}
              </span>
            </div>

            <div className="evaluation-table">
              <div className="evaluation-row evaluation-header">
                <span>Decision</span>
                <span>Predicted Cost</span>
                <span>Actual Cost</span>
                <span>Outcome</span>
              </div>

              <div className="evaluation-empty">
                Evaluation results will appear after operational
                decisions have been recorded and actual outcomes
                are available.
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