function RecommendationCard({
  recommendation,
  selected,
  onSelect,
}) {
  const isFeasible =
    recommendation.feasibility === "feasible";

  return (
    <article
      className={`recommendation-card ${
        selected ? "selected" : ""
      }`}
    >
      <div className="card-header">
        <span className="option-label">
          Option {recommendation.option}
        </span>

        <span
          className={
            isFeasible
              ? "feasibility-badge"
              : "feasibility-badge infeasible"
          }
        >
          {isFeasible ? "FEASIBLE" : "INFEASIBLE"}
        </span>

        {selected && (
          <span className="selected-badge">
            Selected
          </span>
        )}
      </div>

      <h3>{recommendation.action}</h3>

      <div className="recommendation-details">
        <div className="detail-item">
          <span>Cost</span>
          <strong>
            {recommendation.cost ??
              "Not available"}
          </strong>
        </div>

        <div className="detail-item">
          <span>Time / Speed</span>
          <strong>
            {recommendation.time ??
              "Not available"}
          </strong>
        </div>

        <div className="detail-item">
          <span>Capacity</span>
          <strong>
            {recommendation.capacity ??
              "Not available"}
          </strong>
        </div>

        <div className="detail-item">
          <span>Expected Impact</span>
          <strong>
            {recommendation.expected_impact ??
              "Not available"}
          </strong>
        </div>
      </div>

      <div className="reason">
        <span>Recommendation</span>

        <p>
          {recommendation.reason ??
            "Backend optimization result."}
        </p>
      </div>

      <button
        type="button"
        className="select-button"
        onClick={() => onSelect(recommendation)}
        disabled={!isFeasible}
      >
        {!isFeasible
          ? "Unavailable / Infeasible"
          : selected
            ? "Selected"
            : "Select Recommendation"}
      </button>
    </article>
  );
}

export default RecommendationCard;