import { useState } from "react";

import "./App.css";

import RecommendationCard from "./components/RecommendationCard";

import {
  checkBackendHealth,
  executeDecision,
  getDecisionEvaluation,
  getDecisionHistory,
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
  record_id: "",
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

  const [decisionStatus, setDecisionStatus] =
    useState("idle");

  const [decisionError, setDecisionError] =
    useState("");

  const [evaluation, setEvaluation] =
    useState(null);

  const [
    evaluationStatus,
    setEvaluationStatus,
  ] = useState("empty");

  const [evaluationError, setEvaluationError] =
    useState("");

  const [decisionHistory, setDecisionHistory] =
    useState([]);

  const [
    historyStatus,
    setHistoryStatus,
  ] = useState("empty");

  const [historyError, setHistoryError] =
    useState("");

  const handleShipmentChange = (event) => {
    const { name, value } = event.target;

    setShipment((currentShipment) => ({
      ...currentShipment,
      [name]: value,
    }));
  };

  const buildShipmentPayload = () => ({
    record_id: Number(shipment.record_id),

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
      shipment.supplier_country.trim(),

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
  });

  const loadPrediction = async (event) => {
    event.preventDefault();

    setPredictionStatus("loading");
    setPredictionError("");
    setPrediction(null);

    setRecommendationStatus("loading");
    setRecommendationError("");
    setRecommendations([]);
    setSelectedRecommendation(null);

    setDecisionStatus("idle");
    setDecisionError("");

    const trimmedRecordId =
      shipment.record_id.trim();

    if (!trimmedRecordId) {
      setPredictionStatus("error");
      setPredictionError(
        "Record ID is required."
      );

      setRecommendationStatus("error");
      setRecommendationError(
        "Enter a valid record ID before generating recommendations."
      );

      return;
    }

    if (!/^\d+$/.test(trimmedRecordId)) {
      setPredictionStatus("error");
      setPredictionError(
        "Record ID must be a valid database record ID."
      );

      setRecommendationStatus("error");
      setRecommendationError(
        "Record ID must contain only numeric characters."
      );

      return;
    }

    try {
      const payload =
        buildShipmentPayload();

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

      /*
       * Display every solver-generated alternative.
       *
       * Do not use feasible_alternatives here because
       * the UI must show infeasible alternatives too.
       */
      const sourceRecommendations =
        Array.isArray(
          optimization?.alternatives
        )
          ? optimization.alternatives
          : [];

      /*
       * Preserve real backend values.
       *
       * recommendation_id is intentionally NOT
       * fabricated from option numbers.
       */
      const normalizedRecommendations =
        sourceRecommendations.map(
          (item, index) => ({
            ...item,

            id:
              item.recommendation_id ??
              "solver-option-" +
                (item.option ?? index + 1),

            recommendation_id:
              item.recommendation_id ?? null,

            record_id:
              item.record_id ??
              Number(trimmedRecordId),

            option:
              item.option ??
              index + 1,

            action:
              item.action ??
              "Unknown action",

            cost:
              item.cost,

            time:
              item.time,

            capacity:
              item.capacity,

            expected_impact:
              item.expected_impact,

            feasibility:
              item.feasibility,

            reason:
              item.reason ??
              item.description ??
              "Backend optimization result.",
          })
        );

      setRecommendations(
        normalizedRecommendations
      );

      if (
        normalizedRecommendations.length > 0
      ) {
        setRecommendationStatus("success");
      } else if (
        optimization?.status ===
        "no_feasible_solution"
      ) {
        setRecommendationStatus("empty");

        setRecommendationError(
          "No solver alternatives were returned for the provided constraints."
        );
      } else {
        setRecommendationStatus("empty");

        setRecommendationError(
          "No recommendations were returned by the backend."
        );
      }
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

      setDecisionStatus("idle");
      setDecisionError("");
    }
  };

  const handleSelect = (recommendation) => {
    if (
      recommendation.feasibility !==
      "feasible"
    ) {
      return;
    }

    setSelectedRecommendation(
      recommendation
    );

    setDecisionStatus("idle");
    setDecisionError("");
  };

  const handleExecuteDecision = async () => {
    if (
      !selectedRecommendation ||
      decisionStatus === "loading"
    ) {
      return;
    }

    const recordId =
      selectedRecommendation.record_id ??
      shipment.record_id;

    const recommendationId =
      selectedRecommendation.recommendation_id;

    if (!recordId) {
      setDecisionStatus("error");
      setDecisionError(
        "A valid record ID is required."
      );
      return;
    }

    if (!recommendationId) {
      setDecisionStatus("error");
      setDecisionError(
        "The backend did not return a recommendation ID. Decision execution is not available yet."
      );
      return;
    }

    if (
      selectedRecommendation.feasibility !==
      "feasible"
    ) {
      setDecisionStatus("error");
      setDecisionError(
        "An infeasible recommendation cannot be executed."
      );
      return;
    }

    setDecisionStatus("loading");
    setDecisionError("");

    try {
      const decisionPayload = {
        record_id: Number(recordId),
        recommendation_id:
          recommendationId,
        selected_action:
          selectedRecommendation.action,
      };

      const result =
        await executeDecision(
          decisionPayload
        );

      if (!result) {
        throw new Error(
          "Backend did not confirm decision execution."
        );
      }

      setDecisionStatus("success");
    } catch (error) {
      setDecisionStatus("error");

      setDecisionError(
        error.message ||
          "Unable to execute decision."
      );
    }
  };

  const testBackendConnection = async () => {
    setBackendStatus(
      "Checking backend..."
    );

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

  const loadEvaluationData = async () => {
    setEvaluationStatus("loading");
    setEvaluationError("");

    try {
      const data =
        await getDecisionEvaluation();

      if (data) {
        setEvaluation(data);
        setEvaluationStatus("success");
      } else {
        setEvaluation(null);
        setEvaluationStatus("empty");
      }
    } catch (error) {
      setEvaluation(null);
      setEvaluationStatus("error");

      setEvaluationError(
        error.message ||
          "Unable to load decision evaluation."
      );
    }
  };

  const loadDecisionHistory = async () => {
    setHistoryStatus("loading");
    setHistoryError("");

    try {
      const history =
        await getDecisionHistory();

      if (
        Array.isArray(history) &&
        history.length > 0
      ) {
        setDecisionHistory(history);
        setHistoryStatus("success");
      } else {
        setDecisionHistory([]);
        setHistoryStatus("empty");
      }
    } catch (error) {
      setDecisionHistory([]);
      setHistoryStatus("error");

      setHistoryError(
        error.message ||
          "Unable to load decision history."
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
            Enter the database record ID,
            shipment values and operational
            constraints required by the prediction
            and optimization models.
          </p>

          <form
            className="prediction-form"
            onSubmit={loadPrediction}
          >
            <div className="prediction-form-grid">

              <label className="prediction-field">
                <span>
                  Database Record ID
                </span>

                <input
                  type="number"
                  name="record_id"
                  value={shipment.record_id}
                  onChange={
                    handleShipmentChange
                  }
                  min="1"
                  step="1"
                  required
                  placeholder="Enter real record ID"
                />
              </label>

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
                <span>
                  Allowed Time
                </span>

                <input
                  type="number"
                  name="allowed_time"
                  value={
                    shipment.allowed_time
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
                <span>
                  Shipment Time
                </span>

                <input
                  type="number"
                  name="shipment_time"
                  value={
                    shipment.shipment_time
                  }
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

        {/* RECOMMENDATIONS */}

        <section className="section">

          <div className="section-heading">
            <div>
              <h2>
                Recommendations
              </h2>

              <p className="section-description">
                All alternatives generated by the
                backend optimization engine.
                Infeasible alternatives are shown
                but cannot be selected.
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
            "empty" &&
            recommendations.length === 0 && (
            <div className="recommendation-state">
              {recommendationError ||
                "No recommendations are available for the provided constraints."}
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
                    Record ID:{" "}
                    {
                      selectedRecommendation.record_id ??
                      shipment.record_id
                    }
                  </span>

                  <span>
                    Recommendation ID:{" "}
                    {
                      selectedRecommendation.recommendation_id ??
                      "Not available"
                    }
                  </span>

                  <span>
                    Cost:{" "}
                    {
                      selectedRecommendation.cost ??
                      "Not available"
                    }
                  </span>

                  <span>
                    Time:{" "}
                    {
                      selectedRecommendation.time ??
                      "Not available"
                    }
                  </span>

                  <span>
                    Capacity:{" "}
                    {
                      selectedRecommendation.capacity ??
                      "Not available"
                    }
                  </span>

                  <span>
                    Expected Impact:{" "}
                    {
                      selectedRecommendation.expected_impact ??
                      "Not available"
                    }
                  </span>

                  <span>
                    Feasibility:{" "}
                    {
                      selectedRecommendation.feasibility ??
                      "Not available"
                    }
                  </span>

                </div>
              </div>

              <button
                type="button"
                className="execute-button"
                disabled={
                  !selectedRecommendation ||
                  !selectedRecommendation.record_id ||
                  !selectedRecommendation.recommendation_id ||
                  selectedRecommendation.feasibility !==
                    "feasible" ||
                  decisionStatus === "loading"
                }
                onClick={
                  handleExecuteDecision
                }
              >
                {decisionStatus === "loading"
                  ? "Executing..."
                  : "Execute Decision"}
              </button>

              {!selectedRecommendation.recommendation_id && (
                <p className="decision-note">
                  Execute Decision is unavailable
                  until the backend provides a real
                  recommendation ID.
                </p>
              )}

              {decisionStatus === "success" && (
                <p className="decision-note">
                  Decision executed successfully.
                </p>
              )}

              {decisionStatus === "error" && (
                <p className="decision-note">
                  {decisionError}
                </p>
              )}

            </div>
          ) : (
            <p className="section-description">
              Select a feasible recommendation to
              prepare the decision.
            </p>
          )}

        </section>

        {/* DECISION EVALUATION / FEEDBACK */}

        <section className="section">

          <div className="section-heading">

            <div>
              <h2>
                Decision Evaluation / Feedback
              </h2>

              <p className="section-description">
                Compare predicted and actual
                decision outcomes when evaluation
                data becomes available.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={loadEvaluationData}
              disabled={
                evaluationStatus === "loading"
              }
            >
              {evaluationStatus === "loading"
                ? "Loading..."
                : "Refresh Evaluation"}
            </button>

          </div>

          {evaluationStatus === "loading" && (
            <div className="recommendation-state">
              Loading evaluation data...
            </div>
          )}

          {evaluationStatus === "empty" && (
            <div className="recommendation-state">
              <strong>
                No evaluation data available
              </strong>

              <p>
                Evaluation results will appear
                here when the evaluation backend
                becomes available.
              </p>
            </div>
          )}

          {evaluationStatus === "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to load evaluation
              </strong>

              <p>
                {evaluationError ||
                  "Unable to load decision evaluation."}
              </p>
            </div>
          )}

          {evaluationStatus === "success" &&
            evaluation && (
              <div className="evaluation-grid">

                <article className="evaluation-card">
                  <span>
                    Decision ID
                  </span>

                  <strong>
                    {
                      evaluation.decision_id ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Predicted Outcome / Cost
                  </span>

                  <strong>
                    {
                      evaluation.predicted_outcome ??
                      evaluation.predicted_cost ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Actual Outcome / Cost
                  </span>

                  <strong>
                    {
                      evaluation.actual_outcome ??
                      evaluation.actual_cost ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Difference / Discrepancy
                  </span>

                  <strong>
                    {
                      evaluation.discrepancy ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Decision ROI
                  </span>

                  <strong>
                    {
                      evaluation.roi ??
                      "—"
                    }
                  </strong>
                </article>

              </div>
            )}

        </section>

        {/* DECISION HISTORY */}

        <section className="section">

          <div className="section-heading">

            <div>
              <h2>
                Decision History
              </h2>

              <p className="section-description">
                Previous executed decisions and
                their evaluation results.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={
                loadDecisionHistory
              }
              disabled={
                historyStatus === "loading"
              }
            >
              {historyStatus === "loading"
                ? "Loading..."
                : "Refresh History"}
            </button>

          </div>

          {historyStatus === "loading" && (
            <div className="recommendation-state">
              Loading decision history...
            </div>
          )}

          {historyStatus === "empty" && (
            <div className="recommendation-state">
              <strong>
                No decision history available
              </strong>

              <p>
                Previous evaluated decisions will
                appear here when the history backend
                becomes available.
              </p>
            </div>
          )}

          {historyStatus === "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to load decision history
              </strong>

              <p>
                {historyError ||
                  "Unable to load decision history."}
              </p>
            </div>
          )}

          {historyStatus === "success" && (
            <div className="evaluation-history">

              <div className="evaluation-table">

                <div className="evaluation-row evaluation-header">
                  <span>
                    Decision ID
                  </span>

                  <span>
                    Predicted
                  </span>

                  <span>
                    Actual
                  </span>

                  <span>
                    Difference
                  </span>

                  <span>
                    ROI
                  </span>
                </div>

                {decisionHistory.map(
                  (decision, index) => (
                    <div
                      className="evaluation-row"
                      key={
                        decision.decision_id ??
                        index
                      }
                    >
                      <span>
                        {
                          decision.decision_id ??
                          "—"
                        }
                      </span>

                      <span>
                        {
                          decision.predicted_outcome ??
                          decision.predicted_cost ??
                          "—"
                        }
                      </span>

                      <span>
                        {
                          decision.actual_outcome ??
                          decision.actual_cost ??
                          "—"
                        }
                      </span>

                      <span>
                        {
                          decision.discrepancy ??
                          "—"
                        }
                      </span>

                      <span>
                        {
                          decision.roi ??
                          "—"
                        }
                      </span>
                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default App;