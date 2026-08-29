function RecommendationCard({
  recommendation,
  selected,
  onSelect,
  optionLabel,
}) {
  return (
    <article
      className={`recommendation-card ${
        selected ? "selected" : ""
      }`}
    >
      <div className="card-header">
        <span className="option-label">
          {recommendation.option || optionLabel}
        </span>

        {selected && (
          <span className="selected-badge">
            Selected
          </span>
        )}
      </div>

      <h3>
        {recommendation.action || "Solver Recommendation"}
      </h3>

      <div className="recommendation-details">
        <div className="tradeoff-item">
          <span>Cost</span>
          <strong>
            {recommendation.cost || "Not available"}
          </strong>
        </div>

        <div className="tradeoff-item">
          <span>Time</span>
          <strong>
            {recommendation.time ||
              recommendation.speed ||
              "Not available"}
          </strong>
        </div>

        <div className="tradeoff-item">
          <span>Capacity</span>
          <strong>
            {recommendation.capacity || "Not available"}
          </strong>
        </div>

        <div className="tradeoff-item">
          <span>Expected Impact</span>
          <strong>
            {recommendation.expected_impact ||
              recommendation.impact ||
              "Not available"}
          </strong>
        </div>
      </div>

      <div className="reason">
        <span>Reason</span>

        <p>
          {recommendation.reason ||
            "No additional explanation was provided by the solver."}
        </p>
      </div>

      <button
        type="button"
        className="select-button"
        onClick={() => onSelect(recommendation)}
      >
        {selected ? "Selected" : "Select Option"}
      </button>
    </article>
  );
}

export default RecommendationCard;
