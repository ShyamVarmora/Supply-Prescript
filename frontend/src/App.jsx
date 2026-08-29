import { useState } from "react";

import "./App.css";

import RecommendationCard from "./components/RecommendationCard";

import {
  checkBackendHealth,
  executeDecision,
  getDecisionROI,
  getPredictionRecommendations,
  getRecommendations,
} from "./services/api";

const shipmentFields = [
  [
    "warehouse_inventory_level",
    "Warehouse Inventory Level",
  ],
  [
    "handling_equipment_availability",
    "Handling Equipment Availability",
  ],
  [
    "order_fulfillment_status",
    "Order Fulfillment Status",
  ],
  [
    "weather_condition_severity",
    "Weather Condition Severity",
  ],
  [
    "shipping_costs",
    "Shipping Costs",
  ],
  [
    "supplier_reliability_score",
    "Supplier Reliability Score",
  ],
  [
    "lead_time_days",
    "Lead Time Days",
  ],
  [
    "historical_demand",
    "Historical Demand",
  ],
  [
    "cargo_condition_status",
    "Cargo Condition Status",
  ],
  [
    "route_risk_level",
    "Route Risk Level",
  ],
  [
    "customs_clearance_time",
    "Customs Clearance Time",
  ],
];

const optimizationFields = [
  ["budget", "Budget"],
  ["allowed_time", "Allowed Time"],
  ["available_capacity", "Available Capacity"],
  ["shipment_time", "Shipment Time"],
  ["shipment_capacity", "Shipment Capacity"],
];

const initialShipment = {
  warehouse_inventory_level: "",
  handling_equipment_availability: "",
  order_fulfillment_status: "",
  weather_condition_severity: "",
  shipping_costs: "",
  supplier_reliability_score: "",
  lead_time_days: "",
  historical_demand: "",
  cargo_condition_status: "",
  route_risk_level: "",
  customs_clearance_time: "",
  supplier_country: "",
  budget: "",
  allowed_time: "",
  available_capacity: "",
  shipment_time: "",
  shipment_capacity: "",
};

function App() {
  const [shipment, setShipment] =
    useState(initialShipment);

  const [prediction, setPrediction] =
    useState(null);

  const [predictionStatus, setPredictionStatus] =
    useState("idle");

  const [predictionError, setPredictionError] =
    useState("");

  const [recommendations, setRecommendations] =
    useState([]);

  const [
    recommendationStatus,
    setRecommendationStatus,
  ] = useState("idle");

  const [
    recommendationError,
    setRecommendationError,
  ] = useState("");

  const [
    selectedRecommendation,
    setSelectedRecommendation,
  ] = useState(null);

  const [backendStatus, setBackendStatus] =
    useState("");

  const [executionStatus, setExecutionStatus] =
    useState("idle");

  const [executionMessage, setExecutionMessage] =
    useState("");

  const [roiStatus, setRoiStatus] =
    useState("No evaluation data available yet");

  const handleShipmentChange = (event) => {
    const { name, value } = event.target;

    setShipment((currentShipment) => ({
      ...currentShipment,
      [name]: value,
    }));
  };

  const buildRequestData = () => {
    return {
      warehouse_inventory_level: Number(
        shipment.warehouse_inventory_level
      ),
      handling_equipment_availability: Number(
        shipment.handling_equipment_availability
      ),
      order_fulfillment_status: Number(
        shipment.order_fulfillment_status
      ),
      weather_condition_severity: Number(
        shipment.weather_condition_severity
      ),
      shipping_costs: Number(
        shipment.shipping_costs
      ),
      supplier_reliability_score: Number(
        shipment.supplier_reliability_score
      ),
      lead_time_days: Number(
        shipment.lead_time_days
      ),
      historical_demand: Number(
        shipment.historical_demand
      ),
      cargo_condition_status: Number(
        shipment.cargo_condition_status
      ),
      route_risk_level: Number(
        shipment.route_risk_level
      ),
      customs_clearance_time: Number(
        shipment.customs_clearance_time
      ),
      supplier_country:
        shipment.supplier_country,
      budget: Number(shipment.budget),
      allowed_time: Number(
        shipment.allowed_time
      ),
      available_capacity: Number(
        shipment.available_capacity
      ),
      shipment_time: Number(
        shipment.shipment_time
      ),
      shipment_capacity: Number(
        shipment.shipment_capacity
      ),
    };
  };

  const loadPrediction = async (event) => {
    event.preventDefault();

    setPredictionStatus("loading");
    setPredictionError("");
    setPrediction(null);

    try {
      const requestData = buildRequestData();

      const predictionData =
        await getPredictionRecommendations({
          warehouse_inventory_level:
            requestData.warehouse_inventory_level,
          handling_equipment_availability:
            requestData.handling_equipment_availability,
          order_fulfillment_status:
            requestData.order_fulfillment_status,
          weather_condition_severity:
            requestData.weather_condition_severity,
          shipping_costs:
            requestData.shipping_costs,
          supplier_reliability_score:
            requestData.supplier_reliability_score,
          lead_time_days:
            requestData.lead_time_days,
          historical_demand:
            requestData.historical_demand,
          cargo_condition_status:
            requestData.cargo_condition_status,
          route_risk_level:
            requestData.route_risk_level,
          customs_clearance_time:
            requestData.customs_clearance_time,
          supplier_country:
            requestData.supplier_country,
        });

      setPrediction(predictionData);
      setPredictionStatus("success");
    } catch (error) {
      setPredictionStatus("error");
      setPredictionError(error.message);
    }
  };

  const loadRecommendations = async () => {
    setRecommendationStatus("loading");
    setRecommendationError("");
    setRecommendations([]);
    setSelectedRecommendation(null);

    try {
      const requestData = buildRequestData();

      const response =
        await getRecommendations(requestData);

      const optimization =
        response.optimization;

      const backendRecommendations =
        optimization.feasible_alternatives ||
        optimization.alternatives ||
        [];

      setRecommendations(
        backendRecommendations.map(
          (recommendation, index) => ({
            ...recommendation,
            id:
              recommendation.id ||
              recommendation.option ||
              `recommendation-${index}`,
          })
        )
      );

      if (
        optimization.recommended_option
      ) {
        const recommended =
          optimization.recommended_option;

        setSelectedRecommendation({
          ...recommended,
          id:
            recommended.id ||
            recommended.option ||
            "recommended-option",
        });
      }

      if (
        backendRecommendations.length === 0
      ) {
        setRecommendationStatus("empty");
      } else {
        setRecommendationStatus("success");
      }
    } catch (error) {
      setRecommendationStatus("error");
      setRecommendationError(error.message);
    }
  };

  const handleSelect = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setExecutionStatus("idle");
    setExecutionMessage("");
  };

  const testBackendConnection = async () => {
    setBackendStatus("Checking backend...");

    try {
      const data =
        await checkBackendHealth();

      setBackendStatus(
        `Backend connected: ${
          data.status || "ok"
        }`
      );
    } catch (error) {
      setBackendStatus(error.message);
    }
  };

  const handleExecuteDecision = async () => {
    if (!selectedRecommendation) {
      return;
    }

    setExecutionStatus("loading");
    setExecutionMessage("");

    try {
      await executeDecision(
        selectedRecommendation
      );

      setExecutionStatus("success");

      setExecutionMessage(
        "Decision executed successfully."
      );
    } catch (error) {
      setExecutionStatus("error");

      setExecutionMessage(error.message);
    }
  };

  const loadDecisionROI = async () => {
    setRoiStatus("Checking evaluation data...");

    try {
      const data =
        await getDecisionROI();

      if (!data) {
        setRoiStatus(
          "No evaluation data available yet"
        );
        return;
      }

      setRoiStatus("Evaluation data loaded");
    } catch {
      setRoiStatus(
        "No evaluation data available yet"
      );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Supply Prescript</h1>

        <p>
          Supply chain decision support
        </p>
      </header>

      <main className="app-content">

        <section className="section">
          <h2>Shipment Risk</h2>

          <p className="section-description">
            Enter shipment and optimization values
            required by the predictive and
            prescriptive backend.
          </p>

          <form
            className="prediction-form"
            onSubmit={loadPrediction}
          >
            <div className="prediction-form-grid">

              {shipmentFields.map(
                ([name, label]) => (
                  <label
                    key={name}
                    className="prediction-field"
                  >
                    <span>{label}</span>

                    <input
                      type="number"
                      name={name}
                      value={shipment[name]}
                      onChange={
                        handleShipmentChange
                      }
                      step="any"
                      required
                    />
                  </label>
                )
              )}

              <label className="prediction-field">
                <span>
                  Supplier Country
                </span>

                <input
                  type="text"
                  name="supplier_country"
                  value={
                    shipment.supplier_country
                  }
                  onChange={
                    handleShipmentChange
                  }
                  required
                />
              </label>

              {optimizationFields.map(
                ([name, label]) => (
                  <label
                    key={name}
                    className="prediction-field"
                  >
                    <span>{label}</span>

                    <input
                      type="number"
                      name={name}
                      value={shipment[name]}
                      onChange={
                        handleShipmentChange
                      }
                      step="any"
                      required
                    />
                  </label>
                )
              )}

            </div>

            <div className="prediction-controls">

              <button
                type="submit"
                className="secondary-button"
                disabled={
                  predictionStatus === "loading"
                }
              >
                {predictionStatus === "loading"
                  ? "Generating..."
                  : "Generate Prediction"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={
                  loadRecommendations
                }
                disabled={
                  recommendationStatus ===
                  "loading"
                }
              >
                {recommendationStatus ===
                "loading"
                  ? "Generating..."
                  : "Generate Recommendations"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={
                  testBackendConnection
                }
              >
                Test Backend
              </button>

              <span className="backend-status">
                {backendStatus}
              </span>

            </div>
          </form>

          {predictionStatus === "error" && (
            <div className="recommendation-error">
              {predictionError ||
                "Unable to generate shipment prediction."}
            </div>
          )}

          {predictionStatus === "success" &&
            prediction && (
              <div className="prediction-result">

                <span>
                  Prediction Target
                </span>

                <strong>
                  {
                    prediction.prediction_target
                  }
                </strong>

                <span>
                  Predicted Delivery-Time
                  Deviation
                </span>

                <strong>
                  {
                    prediction.predicted_delivery_time_deviation
                  }
                </strong>

              </div>
            )}
        </section>

        <section className="section">

          <div className="section-heading">
            <div>
              <h2>
                Recommendations
              </h2>

              <p className="section-description">
                Real backend-generated
                recommendations based on the
                optimization API.
              </p>
            </div>
          </div>

          {recommendationStatus ===
            "loading" && (
              <div className="recommendation-state">
                Loading recommendations...
              </div>
            )}

          {recommendationStatus ===
            "error" && (
              <div className="recommendation-state error">
                {recommendationError ||
                  "Unable to load recommendations."}
              </div>
            )}

          {recommendationStatus ===
            "empty" && (
              <div className="recommendation-state">
                No feasible recommendations were
                returned by the backend.
              </div>
            )}

          {recommendations.length > 0 && (
            <div className="recommendation-grid">

              {recommendations.map(
                (recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={
                      recommendation
                    }
                    selected={
                      selectedRecommendation?.id ===
                      recommendation.id
                    }
                    onSelect={handleSelect}
                  />
                )
              )}

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

                <h3>
                  {selectedRecommendation.action ||
                    selectedRecommendation.option ||
                    "Selected Recommendation"}
                </h3>

                <p>
                  This recommendation was selected
                  from the real optimization results.
                </p>
              </div>

              <button
                type="button"
                className="execute-button"
                onClick={
                  handleExecuteDecision
                }
                disabled={
                  executionStatus === "loading"
                }
              >
                {executionStatus === "loading"
                  ? "Executing..."
                  : "Execute Decision"}
              </button>

              {executionStatus ===
                "error" && (
                  <p className="execution-error">
                    {executionMessage}
                  </p>
                )}

              {executionStatus ===
                "success" && (
                  <p className="execution-success">
                    {executionMessage}
                  </p>
                )}

              <p className="decision-note">
                The selected recommendation is ready
                for write-back integration. Mansi's
                decision endpoint has not been
                provided yet, so no endpoint has been
                invented.
              </p>

            </div>
          ) : (
            <p className="section-description">
              Generate recommendations and select
              one to prepare the decision.
            </p>
          )}
        </section>

        <section className="section">
          <h2>
            Feedback / Decision ROI
          </h2>

          <div className="roi-grid">

            <article className="roi-card">
              <span>Decision ROI</span>
              <strong>
                No evaluation data available yet
              </strong>
            </article>

            <article className="roi-card">
              <span>
                Positive Outcomes
              </span>

              <strong>
                No evaluation data available yet
              </strong>
            </article>

            <article className="roi-card">
              <span>
                Evaluated Decisions
              </span>

              <strong>
                No evaluation data available yet
              </strong>
            </article>

            <article className="roi-card">
              <span>
                Predicted Cost vs Actual Cost
              </span>

              <strong>
                No evaluation data available yet
              </strong>
            </article>

          </div>

          <div className="evaluation-history">

            <div className="evaluation-heading">

              <div>
                <h3>
                  Evaluation History
                </h3>

                <p className="section-description">
                  Decision evaluation results will
                  appear here when backend
                  evaluation data becomes available.
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
                Evaluation results will appear after
                operational decisions have been
                recorded and actual outcomes are
                available.
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

      </main>
    </div>
  );
}

export default App;