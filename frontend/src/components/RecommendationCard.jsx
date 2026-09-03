function RecommendationCard({
  recommendation,
  selected,
  onSelect,
}) {
  return (
    <article
      className={`recommendation-card ${
        selected ? "selected" : ""
      }`}
    >
      <div className="card-header">
        <span className="option-label">
          {recommendation.option}
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
          <strong>{recommendation.cost}</strong>
        </div>

        <div className="detail-item">
          <span>Time</span>
          <strong>{recommendation.time}</strong>
        </div>

        <div className="detail-item">
          <span>Capacity</span>
          <strong>{recommendation.capacity}</strong>
        </div>

        <div className="detail-item">
          <span>Impact</span>
          <strong>{recommendation.impact}</strong>
        </div>
      </div>

      <div className="reason">
        <span>Recommendation</span>
        <p>{recommendation.reason}</p>
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