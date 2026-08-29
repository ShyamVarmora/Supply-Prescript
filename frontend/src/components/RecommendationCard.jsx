function formatValue(value) {
  if (value === null || value === undefined) {
    return "Not available";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function RecommendationCard({
  recommendation,
  selected,
  onSelect,
}) {
  const recommendationName =
    recommendation.option ||
    recommendation.action ||
    "Recommendation";

  return (
    <article
      className={`recommendation-card ${
        selected ? "selected" : ""
      }`}
    >
      <div className="card-header">
        <span className="option-label">
          {recommendationName}
        </span>

        {selected && (
          <span className="selected-badge">
            Selected
          </span>
        )}
      </div>

      <h3>
        {recommendation.action || recommendationName}
      </h3>

      <div className="recommendation-details">
        <div className="detail-item">
          <span>Cost</span>
          <strong>
            {formatValue(
              recommendation.cost ??
                recommendation.expected_cost
            )}
          </strong>
        </div>

        <div className="detail-item">
          <span>Time</span>
          <strong>
            {formatValue(
              recommendation.time ??
                recommendation.expected_time
            )}
          </strong>
        </div>

        <div className="detail-item">
          <span>Capacity</span>
          <strong>
            {formatValue(
              recommendation.capacity ??
                recommendation.required_capacity
            )}
          </strong>
        </div>

        <div className="detail-item">
          <span>Impact</span>
          <strong>
            {formatValue(
              recommendation.expected_impact ??
                recommendation.impact
            )}
          </strong>
        </div>
      </div>

      <div className="reason">
        <span>Feasibility</span>

        <p>
          {recommendation.feasibility ||
            "Backend-generated recommendation"}
        </p>
      </div>

      <button
        type="button"
        className="select-button"
        onClick={() => onSelect(recommendation)}
      >
        {selected
          ? "Selected"
          : "Select Recommendation"}
      </button>
    </article>
  );
}

export default RecommendationCard;