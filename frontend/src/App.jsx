import { useState } from "react";

import "./App.css";

import RecommendationCard from "./components/RecommendationCard";

import {
  checkBackendHealth,
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

  const [backendStatus, setBackendStatus] =
    useState("Backend status not checked");

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

  const [roiStatus, setRoiStatus] =
    useState("No evaluation data checked yet");

  const handleShipmentChange = (event) => {
    const { name, value } = event.target;

    setShipment((currentShipment) => ({
      ...currentShipment,
      [name]: value,
    }));
  };

  const buildShipmentPayload = () => {
    const numericFields = [
      "warehouse_inventory_level",
      "handling_equipment_availability",
      "order_fulfillment_status",
      "weather_condition_severity",
      "shipping_costs",
      "supplier_reliability_score",
      "lead_time_days",
      "historical_demand",
      "cargo_condition_status",
      "route_risk_level",
      "customs_clearance_time",
      "budget",
      "allowed_time",
      "available_capacity",
      "shipment_time",
      "shipment_capacity",
    ];

    const payload = {
      supplier_country:
        shipment.supplier_country.trim(),
    };

    numericFields.forEach((field) => {
      payload[field] = Number(shipment[field]);
    });

    return payload;
  };

  const loadPrediction = async (event) => {
    event.preventDefault();

    setPredictionStatus("loading");
    setPredictionError("");
    setPrediction(null);

    setRecommendationStatus("loading");
    setRecommendationError("");
    setRecommendations([]);
    setSelectedRecommendation(null);

    try {
      const payload = buildShipmentPayload();

      /*
       * POST /recommend performs:
       *
       * shipment input
       *      ↓
       * delay prediction
       *      ↓
       * constrained optimization
       *      ↓
       * recommendation alternatives
       */
      const result =
        await getRecommendations(payload);

      const backendPrediction =
        result?.prediction;

      const optimization =
        result?.optimization;

      if (!backendPrediction) {
        throw new Error(
          "Prediction data was not returned by the backend."
        );
      }

      setPrediction({
        prediction_target:
          backendPrediction.target,
        predicted_delivery_time_deviation:
          backendPrediction.predicted_delay,
      });

      setPredictionStatus("success");

      const alternatives =
        optimization?.alternatives || [];

      const feasibleAlternatives =
        optimization?.feasible_alternatives || [];

      /*
       * Display feasible alternatives when available.
       * If backend returns no feasible alternatives,
       * keep the UI in the empty state.
       */
      const sourceRecommendations =
        feasibleAlternatives.length > 0
          ? feasibleAlternatives
          : [];

      const normalizedRecommendations =
        sourceRecommendations.map(
          (recommendation, index) => ({
            ...recommendation,

            id:
              recommendation.id ??
              recommendation.option ??
              `recommendation-${index}`,

            option:
              recommendation.option ??
              `Option ${index + 1}`,

            action:
              recommendation.action ??
              recommendation.name ??
              "Recommended Action",

            cost:
              recommendation.cost ??
              recommendation.expected_cost ??
              "Not available",

            time:
              recommendation.time ??
              recommendation.expected_time ??
              "Not available",

            capacity:
              recommendation.capacity ??
              recommendation.required_capacity ??
              "Not available",

            impact:
              recommendation.expected_impact ??
              recommendation.impact ??
              "Not available",

            reason:
              recommendation.reason ??
              recommendation.description ??
              "Backend optimization result.",
          })
        );

      setRecommendations(
        normalizedRecommendations
      );

      if (normalizedRecommendations.length > 0) {
        setRecommendationStatus("success");
      } else if (
        optimization?.status ===
        "no_feasible_solution"
      ) {
        setRecommendationStatus("empty");

        setRecommendationError(
          "No feasible recommendations were found for the provided constraints."
        );
      } else {
        setRecommendationStatus("empty");
      }

      /*
       * Keep this available for compatibility with
       * the existing prediction endpoint, but the
       * recommendation flow above uses POST /recommend.
       */
      await getPredictionRecommendations(
        payload
      ).catch(() => null);

      /*
       * Avoid unused optimization data while retaining
       * the backend response structure for debugging.
       */
      void alternatives;
    } catch (error) {
      setPredictionStatus("error");

      setPredictionError(
        error.message ||
          "Unable to generate shipment prediction."
      );

      setRecommendationStatus("error");

      setRecommendationError(
        error.message ||
          "Unable to load recommendations."
      );

      setRecommendations([]);
      setSelectedRecommendation(null);
    }
  };

  const handleSelect = (recommendation) => {
    setSelectedRecommendation(recommendation);
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
        {/* SHIPMENT RISK */}

        <section className="section">
          <h2>Shipment Risk</h2>

          <p className="section-description">
            Enter the shipment values and operational
            constraints required by the prediction and
            optimization models.
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

              <label className="prediction-field">
                <span>Budget</span>

                <input
                  type="number"
                  name="budget"
                  value={shipment.budget}
                  onChange={
                    handleShipmentChange
                  }
                  step="any"
                  min="0"
                  required
                />
              </label>

              <label className="prediction-field">
                <span>Allowed Time</span>

                <input
                  type="number"
                  name="allowed_time"
                  value={shipment.allowed_time}
                  onChange={
                    handleShipmentChange
                  }
                  step="any"
                  min="0"
                  required
                />
              </label>

              <label className="prediction-field">
                <span>
                  Available Capacity
                </span>

                <input
                  type="number"
                  name="available_capacity"
                  value={
                    shipment.available_capacity
                  }
                  onChange={
                    handleShipmentChange
                  }
                  step="any"
                  min="0"
                  required
                />
              </label>

              <label className="prediction-field">
                <span>Shipment Time</span>

                <input
                  type="number"
                  name="shipment_time"
                  value={shipment.shipment_time}
                  onChange={
                    handleShipmentChange
                  }
                  step="any"
                  min="0.0001"
                  required
                />
              </label>

              <label className="prediction-field">
                <span>
                  Shipment Capacity
                </span>

                <input
                  type="number"
                  name="shipment_capacity"
                  value={
                    shipment.shipment_capacity
                  }
                  onChange={
                    handleShipmentChange
                  }
                  step="any"
                  min="0.0001"
                  required
                />
              </label>
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
                  {prediction.prediction_target}
                </strong>

                <span>
                  Predicted Delivery-Time Deviation
                </span>

                <strong>
                  {
                    prediction.predicted_delivery_time_deviation
                  }
                </strong>
              </div>
            )}
        </section>

        {/* RECOMMENDATIONS */}

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Recommendations</h2>

              <p className="section-description">
                Recommendations generated by the backend
                optimization engine.
              </p>
            </div>
          </div>

          {recommendationStatus === "loading" && (
            <div className="recommendation-state">
              Loading recommendations...
            </div>
          )}

          {recommendationStatus === "error" && (
            <div className="recommendation-state error">
              {recommendationError ||
                "Unable to load recommendations."}
            </div>
          )}

          {recommendationStatus === "empty" &&
            recommendations.length === 0 && (
              <div className="recommendation-state">
                {recommendationError ||
                  "No feasible recommendations are available for the provided constraints."}
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

        {/* DECISION */}

        <section className="section">
          <h2>Decision</h2>

          {selectedRecommendation ? (
            <div className="decision-panel">
              <div>
                <span className="decision-label">
                  Selected Recommendation
                </span>

                <h3>
                  {
                    selectedRecommendation.action
                  }
                </h3>

                <p>
                  {
                    selectedRecommendation.reason
                  }
                </p>

                <div className="decision-details">
                  <span>
                    Cost:{" "}
                    {
                      selectedRecommendation.cost
                    }
                  </span>

                  <span>
                    Time:{" "}
                    {
                      selectedRecommendation.time
                    }
                  </span>

                  <span>
                    Capacity:{" "}
                    {
                      selectedRecommendation.capacity
                    }
                  </span>

                  <span>
                    Impact:{" "}
                    {
                      selectedRecommendation.impact
                    }
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
                The selected recommendation is ready
                for write-back integration. Mansi's
                decision write-back endpoint is not
                available yet, so decision execution
                remains disabled.
              </p>
            </div>
          ) : (
            <p className="section-description">
              Select a recommendation to prepare the
              decision.
            </p>
          )}
        </section>

        {/* FEEDBACK / ROI */}

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
                  appear here when backend evaluation
                  data becomes available.
                </p>
              </div>

              <span className="roi-status">
                {roiStatus}
              </span>
            </div>

            <div className="evaluation-table">
              <div className="evaluation-row evaluation-header">
                <span>Decision</span>

                <span>
                  Predicted Cost
                </span>

                <span>
                  Actual Cost
                </span>

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