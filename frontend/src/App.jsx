import { useState } from "react";

import "./App.css";

import RecommendationCard from "./components/RecommendationCard";

import {
  checkBackendHealth,
  executeDecision,
  getDecisionEvaluation,
  getDecisionHistory,
  getRecommendations,
  getRoiAnalytics,
  recordDecisionOutcome,
} from "./services/api";

const initialShipment = {
  record_id: "",
  budget: "",
  allowed_time: "",
  available_capacity: "",
  shipment_time: "",
  shipment_capacity: "",
};

const initialOutcome = {
  actual_cost: "",
  actual_delay_days: "",
  outcome_status: "",
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

  const [decisionId, setDecisionId] =
    useState(null);

  const [decisionStatus, setDecisionStatus] =
    useState("idle");

  const [decisionError, setDecisionError] =
    useState("");

  const [outcome, setOutcome] =
    useState(initialOutcome);

  const [outcomeStatus, setOutcomeStatus] =
    useState("idle");

  const [outcomeError, setOutcomeError] =
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

  const [roiAnalytics, setRoiAnalytics] =
    useState(null);

  const [
    roiAnalyticsStatus,
    setRoiAnalyticsStatus,
  ] = useState("empty");

  const [
    roiAnalyticsError,
    setRoiAnalyticsError,
  ] = useState("");

  const handleShipmentChange = (event) => {
    const { name, value } = event.target;

    setShipment((currentShipment) => ({
      ...currentShipment,
      [name]: value,
    }));
  };

  const handleOutcomeChange = (event) => {
    const { name, value } = event.target;

    setOutcome((currentOutcome) => ({
      ...currentOutcome,
      [name]: value,
    }));
  };

  const buildRecommendationPayload = () => ({
    record_id: Number(shipment.record_id),

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

    const recordId =
      shipment.record_id.trim();

    if (!recordId) {
      setPredictionStatus("error");

      setPredictionError(
        "Record ID is required."
      );

      setRecommendationStatus("error");

      setRecommendationError(
        "Enter a valid database record ID before generating recommendations."
      );

      return;
    }

    if (!/^\d+$/.test(recordId)) {
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

    if (
      shipment.budget === "" ||
      shipment.allowed_time === "" ||
      shipment.available_capacity === "" ||
      shipment.shipment_time === "" ||
      shipment.shipment_capacity === ""
    ) {
      setPredictionStatus("error");

      setPredictionError(
        "Complete all required operational constraint fields."
      );

      setRecommendationStatus("error");

      setRecommendationError(
        "Budget, allowed time, available capacity, shipment time, and shipment capacity are required by the current backend."
      );

      return;
    }

    setPredictionStatus("loading");
    setPredictionError("");

    setRecommendationStatus("loading");
    setRecommendationError("");

    setRecommendations([]);
    setSelectedRecommendation(null);

    setDecisionId(null);
    setDecisionStatus("idle");
    setDecisionError("");

    setOutcome(initialOutcome);
    setOutcomeStatus("idle");
    setOutcomeError("");

    setEvaluation(null);
    setEvaluationStatus("empty");
    setEvaluationError("");

    try {
      const payload =
        buildRecommendationPayload();

      const result =
        await getRecommendations(
          payload
        );

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
       * Current backend returns recommendations
       * inside optimization.stored_recommendations.
       *
       * The alternatives fallback is retained
       * for compatibility with an older response.
       */
      const sourceRecommendations =
        Array.isArray(
          optimization?.stored_recommendations
        )
          ? optimization.stored_recommendations
          : Array.isArray(
                optimization?.alternatives
              )
            ? optimization.alternatives
            : [];

      const normalizedRecommendations =
        sourceRecommendations.map(
          (item, index) => ({
            ...item,

            id:
              item.recommendation_id ??
              `solver-option-${
                item.option ?? index + 1
              }`,

            recommendation_id:
              item.recommendation_id ??
              null,

            record_id:
              item.record_id ??
              Number(recordId),

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
        setRecommendationStatus(
          "success"
        );
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

        setRecommendationError(
          "No recommendation alternatives were returned by the backend."
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

      setDecisionId(null);
      setDecisionStatus("idle");
      setDecisionError("");

      setOutcome(initialOutcome);
      setOutcomeStatus("idle");
      setOutcomeError("");

      setEvaluation(null);
      setEvaluationStatus("empty");
      setEvaluationError("");
    }
  };

  const handleSelect = (
    recommendation
  ) => {
    if (
      recommendation.feasibility !==
      "feasible"
    ) {
      return;
    }

    if (
      !recommendation.recommendation_id
    ) {
      setDecisionStatus("error");

      setDecisionError(
        "This recommendation does not have a valid backend recommendation ID."
      );

      return;
    }

    setSelectedRecommendation(
      recommendation
    );

    setDecisionId(null);

    setDecisionStatus("idle");
    setDecisionError("");

    setOutcome(initialOutcome);
    setOutcomeStatus("idle");
    setOutcomeError("");

    setEvaluation(null);
    setEvaluationStatus("empty");
    setEvaluationError("");
  };

  const loadDecisionHistory =
    async () => {
      setHistoryStatus("loading");
      setHistoryError("");

      try {
        const result =
          await getDecisionHistory();

        const history =
          Array.isArray(result)
            ? result
            : Array.isArray(
                  result?.decisions
                )
              ? result.decisions
              : [];

        if (history.length > 0) {
          setDecisionHistory(history);

          setHistoryStatus(
            "success"
          );
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

  const loadRoiAnalytics =
    async () => {
      setRoiAnalyticsStatus(
        "loading"
      );

      setRoiAnalyticsError("");

      try {
        const result =
          await getRoiAnalytics();

        if (result) {
          setRoiAnalytics(result);

          setRoiAnalyticsStatus(
            "success"
          );
        } else {
          setRoiAnalytics(null);

          setRoiAnalyticsStatus(
            "empty"
          );
        }
      } catch (error) {
        setRoiAnalytics(null);

        setRoiAnalyticsStatus("error");

        setRoiAnalyticsError(
          error.message ||
            "Unable to load ROI analytics."
        );
      }
    };

  const handleExecuteDecision =
    async () => {
      if (
        !selectedRecommendation ||
        selectedRecommendation.feasibility !==
          "feasible" ||
        !selectedRecommendation.record_id ||
        !selectedRecommendation.recommendation_id ||
        decisionStatus === "loading"
      ) {
        return;
      }

      setDecisionStatus("loading");
      setDecisionError("");

      setDecisionId(null);

      setOutcome(initialOutcome);
      setOutcomeStatus("idle");
      setOutcomeError("");

      setEvaluation(null);
      setEvaluationStatus("empty");
      setEvaluationError("");

      try {
        const decisionPayload = {
          record_id: Number(
            selectedRecommendation.record_id
          ),

          recommendation_id: Number(
            selectedRecommendation.recommendation_id
          ),

          selected_action:
            selectedRecommendation.action,

          decision_status: "SELECTED",
        };

        const result =
          await executeDecision(
            decisionPayload
          );

        const returnedDecisionId =
          result?.decision_id;

        if (!returnedDecisionId) {
          throw new Error(
            "Backend did not return a decision ID."
          );
        }

        setDecisionId(
          returnedDecisionId
        );

        setDecisionStatus(
          "success"
        );

        await loadDecisionHistory();
      } catch (error) {
        setDecisionStatus("error");

        setDecisionError(
          error.message ||
            "Unable to execute decision."
        );
      }
    };

  const handleRecordOutcome =
    async (event) => {
      event.preventDefault();

      if (!decisionId) {
        setOutcomeStatus("error");

        setOutcomeError(
          "A successful decision execution is required before recording an outcome."
        );

        return;
      }

      const hasActualCost =
        outcome.actual_cost.trim() !== "";

      const hasActualDelay =
        outcome.actual_delay_days.trim() !== "";

      const hasOutcomeStatus =
        outcome.outcome_status.trim() !== "";

      if (
        !hasActualCost &&
        !hasActualDelay &&
        !hasOutcomeStatus
      ) {
        setOutcomeStatus("error");

        setOutcomeError(
          "Enter at least one actual outcome value."
        );

        return;
      }

      if (
        hasActualCost &&
        Number(outcome.actual_cost) < 0
      ) {
        setOutcomeStatus("error");

        setOutcomeError(
          "Actual cost cannot be negative."
        );

        return;
      }

      if (
        hasActualDelay &&
        Number(
          outcome.actual_delay_days
        ) < 0
      ) {
        setOutcomeStatus("error");

        setOutcomeError(
          "Actual delay days cannot be negative."
        );

        return;
      }

      setOutcomeStatus("loading");
      setOutcomeError("");

      try {
        const outcomePayload = {};

        if (hasActualCost) {
          outcomePayload.actual_cost =
            Number(
              outcome.actual_cost
            );
        }

        if (hasActualDelay) {
          outcomePayload.actual_delay_days =
            Number(
              outcome.actual_delay_days
            );
        }

        if (hasOutcomeStatus) {
          outcomePayload.outcome_status =
            outcome.outcome_status.trim();
        }

        await recordDecisionOutcome(
          decisionId,
          outcomePayload
        );

        setOutcomeStatus(
          "success"
        );

        await loadEvaluationData(
          decisionId
        );

        await loadDecisionHistory();

        await loadRoiAnalytics();
      } catch (error) {
        setOutcomeStatus("error");

        setOutcomeError(
          error.message ||
            "Unable to record decision outcome."
        );
      }
    };

  const loadEvaluationData =
    async (
      requestedDecisionId = decisionId
    ) => {
      if (!requestedDecisionId) {
        setEvaluation(null);

        setEvaluationStatus("empty");

        setEvaluationError("");

        return;
      }

      setEvaluationStatus("loading");
      setEvaluationError("");

      try {
        const result =
          await getDecisionEvaluation(
            requestedDecisionId
          );

        const evaluationData =
          result?.evaluation ??
          result ??
          null;

        if (evaluationData) {
          setEvaluation(
            evaluationData
          );

          setEvaluationStatus(
            "success"
          );
        } else {
          setEvaluation(null);

          setEvaluationStatus(
            "empty"
          );
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

  const testBackendConnection =
    async () => {
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
        setBackendStatus(
          error.message ||
            "Backend connection failed."
        );
      }
    };

  const formatPercentage = (
    value
  ) => {
    if (value == null) {
      return "—";
    }

    const numericValue =
      Number(value);

    if (
      Number.isNaN(numericValue)
    ) {
      return "—";
    }

    return `${numericValue.toFixed(
      2
    )}%`;
  };

  const formatMetric = (value) => {
    if (value == null) {
      return "—";
    }

    return value;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          Supply Prescript
        </h1>

        <p>
          Supply chain decision support
        </p>
      </header>

      <main className="app-content">
        {/* SHIPMENT RISK */}

        <section className="section">
          <h2>
            Shipment Risk
          </h2>

          <p className="section-description">
            Enter the database record ID
            and the operational constraints
            required by the current backend.
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
                  value={
                    shipment.record_id
                  }
                  onChange={
                    handleShipmentChange
                  }
                  min="1"
                  step="1"
                  required
                  placeholder="Enter real record ID"
                />
              </label>

              <label className="prediction-field">
                <span>
                  Budget
                </span>

                <input
                  type="number"
                  name="budget"
                  value={
                    shipment.budget
                  }
                  onChange={
                    handleShipmentChange
                  }
                  step="any"
                  min="0"
                  required
                  placeholder="Enter budget"
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
                  placeholder="Enter allowed time"
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
                  placeholder="Enter capacity"
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
                  placeholder="Shipment time"
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
                  placeholder="Shipment capacity"
                />
              </label>
            </div>

            <div className="prediction-controls">
              <button
                type="submit"
                className="secondary-button"
                disabled={
                  predictionStatus ===
                  "loading"
                }
              >
                {predictionStatus ===
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

          {predictionStatus ===
            "loading" && (
            <div className="recommendation-state">
              Generating shipment prediction
              and recommendations...
            </div>
          )}

          {predictionStatus ===
            "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to generate shipment prediction
              </strong>

              <p>
                {predictionError}
              </p>
            </div>
          )}

          {predictionStatus ===
            "success" &&
            prediction && (
              <div className="prediction-result">
                <span>
                  Predicted Shipment Delay
                </span>

                <strong>
                  {
                    prediction.predicted_delivery_time_deviation
                  }
                </strong>

                <small>
                  {
                    prediction.prediction_target
                  }
                </small>
              </div>
            )}
        </section>

        {/* RECOMMENDATIONS */}

        <section className="section">
          <h2>
            Recommendations
          </h2>

          <p className="section-description">
            All backend-generated alternatives
            are shown with cost, time,
            capacity, expected impact, and
            feasibility.
          </p>

          {recommendationStatus ===
            "loading" && (
            <div className="recommendation-state">
              Loading recommendations...
            </div>
          )}

          {recommendationStatus ===
            "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to load recommendations
              </strong>

              <p>
                {recommendationError}
              </p>
            </div>
          )}

          {recommendationStatus ===
            "empty" && (
            <div className="recommendation-state">
              <strong>
                No recommendation alternatives
                yet.
              </strong>

              <p>
                {recommendationError ||
                  "No recommendation alternatives were returned by the backend."}
              </p>
            </div>
          )}

          {recommendationStatus ===
            "success" &&
            recommendations.length > 0 && (
              <div className="recommendation-grid">
                {recommendations.map(
                  (recommendation) => (
                    <RecommendationCard
                      key={
                        recommendation.id
                      }
                      recommendation={
                        recommendation
                      }
                      selected={
                        selectedRecommendation?.id ===
                        recommendation.id
                      }
                      onSelect={
                        handleSelect
                      }
                    />
                  )
                )}
              </div>
            )}
        </section>

        {/* DECISION */}

        <section className="section">
          <h2>
            Decision
          </h2>

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
                      selectedRecommendation.record_id
                    }
                  </span>

                  <span>
                    Recommendation ID:{" "}
                    {
                      selectedRecommendation.recommendation_id ??
                      "—"
                    }
                  </span>

                  <span>
                    Cost:{" "}
                    {
                      selectedRecommendation.cost ??
                      "—"
                    }
                  </span>

                  <span>
                    Time:{" "}
                    {
                      selectedRecommendation.time ??
                      "—"
                    }
                  </span>

                  <span>
                    Capacity:{" "}
                    {
                      selectedRecommendation.capacity ??
                      "—"
                    }
                  </span>

                  <span>
                    Expected Impact:{" "}
                    {
                      selectedRecommendation.expected_impact ??
                      "—"
                    }
                  </span>

                  <span>
                    Feasibility:{" "}
                    {selectedRecommendation.feasibility ===
                    "feasible"
                      ? "FEASIBLE"
                      : "INFEASIBLE"}
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
                  decisionStatus ===
                    "loading"
                }
                onClick={
                  handleExecuteDecision
                }
              >
                {decisionStatus ===
                "loading"
                  ? "Executing..."
                  : "Execute Decision"}
              </button>

              {decisionStatus ===
                "success" &&
                decisionId && (
                  <p className="decision-note">
                    Decision executed
                    successfully.
                    <br />

                    <strong>
                      Decision ID:{" "}
                      {decisionId}
                    </strong>
                  </p>
                )}

              {decisionStatus ===
                "error" && (
                <p className="decision-note">
                  {decisionError}
                </p>
              )}
            </div>
          ) : (
            <p className="section-description">
              Select a feasible recommendation
              to prepare the decision.
            </p>
          )}
        </section>

        {/* ACTUAL OUTCOME */}

        <section className="section">
          <h2>
            Actual Outcome
          </h2>

          <p className="section-description">
            Record the actual result after the
            selected decision has been executed.
          </p>

          {!decisionId && (
            <div className="recommendation-state">
              Execute a decision first to
              record its actual outcome.
            </div>
          )}

          {decisionId && (
            <form
              className="prediction-form"
              onSubmit={
                handleRecordOutcome
              }
            >
              <div className="prediction-form-grid">
                <label className="prediction-field">
                  <span>
                    Decision ID
                  </span>

                  <input
                    type="text"
                    value={decisionId}
                    readOnly
                  />
                </label>

                <label className="prediction-field">
                  <span>
                    Actual Cost
                  </span>

                  <input
                    type="number"
                    name="actual_cost"
                    value={
                      outcome.actual_cost
                    }
                    onChange={
                      handleOutcomeChange
                    }
                    min="0"
                    step="any"
                    placeholder="Actual cost"
                  />
                </label>

                <label className="prediction-field">
                  <span>
                    Actual Delay Days
                  </span>

                  <input
                    type="number"
                    name="actual_delay_days"
                    value={
                      outcome.actual_delay_days
                    }
                    onChange={
                      handleOutcomeChange
                    }
                    min="0"
                    step="any"
                    placeholder="Actual delay"
                  />
                </label>

                <label className="prediction-field">
                  <span>
                    Outcome Status
                  </span>

                  <input
                    type="text"
                    name="outcome_status"
                    value={
                      outcome.outcome_status
                    }
                    onChange={
                      handleOutcomeChange
                    }
                    placeholder="completed / delayed / cancelled"
                  />
                </label>
              </div>

              <div className="prediction-controls">
                <button
                  type="submit"
                  className="secondary-button"
                  disabled={
                    outcomeStatus ===
                    "loading"
                  }
                >
                  {outcomeStatus ===
                  "loading"
                    ? "Recording..."
                    : "Record Outcome"}
                </button>
              </div>

              {outcomeStatus ===
                "success" && (
                <p className="decision-note">
                  Actual outcome recorded
                  successfully.
                </p>
              )}

              {outcomeStatus ===
                "error" && (
                <p className="decision-note">
                  {outcomeError}
                </p>
              )}
            </form>
          )}
        </section>

        {/* DECISION EVALUATION */}

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>
                Decision Evaluation /
                Feedback
              </h2>

              <p className="section-description">
                Compare predicted and actual
                decision outcomes using real
                backend evaluation data.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                loadEvaluationData()
              }
              disabled={
                !decisionId ||
                evaluationStatus ===
                  "loading"
              }
            >
              {evaluationStatus ===
              "loading"
                ? "Loading..."
                : "Refresh Evaluation"}
            </button>
          </div>

          {!decisionId && (
            <div className="recommendation-state">
              Execute a decision to view its
              evaluation.
            </div>
          )}

          {decisionId &&
            evaluationStatus ===
              "empty" && (
              <div className="recommendation-state">
                <strong>
                  No evaluated decision yet.
                </strong>

                <p>
                  Record an actual outcome to
                  evaluate this decision.
                </p>
              </div>
            )}

          {evaluationStatus ===
            "loading" && (
            <div className="recommendation-state">
              Loading evaluation data...
            </div>
          )}

          {evaluationStatus ===
            "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to load evaluation
              </strong>

              <p>
                {evaluationError}
              </p>
            </div>
          )}

          {evaluationStatus ===
            "success" &&
            evaluation && (
              <div className="evaluation-grid">
                <article className="evaluation-card">
                  <span>
                    Decision ID
                  </span>

                  <strong>
                    {
                      evaluation.decision_id ??
                      decisionId
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Predicted Cost
                  </span>

                  <strong>
                    {
                      evaluation.predicted_cost ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Actual Cost
                  </span>

                  <strong>
                    {
                      evaluation.actual_cost ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Absolute Difference
                  </span>

                  <strong>
                    {
                      evaluation.absolute_difference ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Percentage Difference
                  </span>

                  <strong>
                    {formatPercentage(
                      evaluation.percentage_difference
                    )}
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      evaluation.status ??
                      "—"
                    }
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Decision ROI
                  </span>

                  <strong>
                    {formatPercentage(
                      evaluation.roi_percent
                    )}
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
                Previously stored decisions and
                their real backend evaluation
                results.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={
                loadDecisionHistory
              }
              disabled={
                historyStatus ===
                "loading"
              }
            >
              {historyStatus ===
              "loading"
                ? "Loading..."
                : "Refresh History"}
            </button>
          </div>

          {historyStatus ===
            "empty" && (
            <div className="recommendation-state">
              <strong>
                No decision history yet.
              </strong>

              <p>
                Stored decisions will appear
                here after a decision is
                executed.
              </p>
            </div>
          )}

          {historyStatus ===
            "loading" && (
            <div className="recommendation-state">
              Loading decision history...
            </div>
          )}

          {historyStatus ===
            "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to load decision history
              </strong>

              <p>
                {historyError}
              </p>
            </div>
          )}

          {historyStatus ===
            "success" && (
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
                  (
                    decision,
                    index
                  ) => {
                    const decisionEvaluation =
                      decision.evaluation ??
                      {};

                    return (
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
                          {decisionEvaluation
                            .predicted_cost ??
                            decision.expected_cost ??
                            "—"}
                        </span>

                        <span>
                          {decisionEvaluation
                            .actual_cost ??
                            decision.actual_cost ??
                            "—"}
                        </span>

                        <span>
                          {decisionEvaluation
                            .absolute_difference ??
                            "—"}
                        </span>

                        <span>
                          {formatPercentage(
                            decisionEvaluation.roi_percent
                          )}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </section>

        {/* ROI ANALYTICS */}

        <section className="section">
          <div className="section-heading">
            <div>
              <h2>
                ROI Analytics
              </h2>

              <p className="section-description">
                Aggregated ROI metrics from
                evaluated decisions using real
                backend data.
              </p>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={
                loadRoiAnalytics
              }
              disabled={
                roiAnalyticsStatus ===
                "loading"
              }
            >
              {roiAnalyticsStatus ===
              "loading"
                ? "Loading..."
                : "Refresh ROI Analytics"}
            </button>
          </div>

          {roiAnalyticsStatus ===
            "empty" && (
            <div className="recommendation-state">
              <strong>
                No ROI analytics data available.
              </strong>

              <p>
                ROI analytics will appear when
                the backend has evaluated decision
                outcomes.
              </p>
            </div>
          )}

          {roiAnalyticsStatus ===
            "loading" && (
            <div className="recommendation-state">
              Loading ROI analytics...
            </div>
          )}

          {roiAnalyticsStatus ===
            "error" && (
            <div className="recommendation-state error">
              <strong>
                Unable to load ROI analytics
              </strong>

              <p>
                {roiAnalyticsError}
              </p>
            </div>
          )}

          {roiAnalyticsStatus ===
            "success" &&
            roiAnalytics && (
              <div className="evaluation-grid">
                <article className="evaluation-card">
                  <span>
                    Total Decisions
                  </span>

                  <strong>
                    {formatMetric(
                      roiAnalytics.total_decisions
                    )}
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Evaluated Decisions
                  </span>

                  <strong>
                    {formatMetric(
                      roiAnalytics.evaluated_decisions
                    )}
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Positive Outcomes
                  </span>

                  <strong>
                    {formatMetric(
                      roiAnalytics.positive_outcomes
                    )}
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Negative Outcomes
                  </span>

                  <strong>
                    {formatMetric(
                      roiAnalytics.negative_outcomes
                    )}
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Positive Outcome Rate
                  </span>

                  <strong>
                    {formatPercentage(
                      roiAnalytics.positive_outcome_rate
                    )}
                  </strong>
                </article>

                <article className="evaluation-card">
                  <span>
                    Average ROI
                  </span>

                  <strong>
                    {formatPercentage(
                      roiAnalytics.average_roi
                    )}
                  </strong>
                </article>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default App;