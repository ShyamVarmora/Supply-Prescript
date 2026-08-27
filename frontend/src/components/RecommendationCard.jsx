function RecommendationCard({
  recommendation,
  selected,
  onSelect,
}) {
  return (
    <article
      className={`recommendation-card ${selected ? "selected" : ""}`}
    >
      <div className="card-header">
        <span className="option-label">
          {recommendation.option}
        </span>

        {selected && (
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
        onClick={() => onSelect(recommendation)}
      >
        {selected ? "Selected" : "Select Recommendation"}
      </button>
    </article>
  );
}

export default RecommendationCard;