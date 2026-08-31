USE supply_prescript_db;

-- 1. Risk class distribution
SELECT
    predicted_risk_class,
    COUNT(*) AS total_records
FROM predictions
GROUP BY predicted_risk_class
ORDER BY total_records DESC;


-- 2. Recommended action distribution
SELECT
    action,
    COUNT(*) AS total_recommendations
FROM prescriptive_recommendations
GROUP BY action
ORDER BY total_recommendations DESC;


-- 3. Total expected mitigation cost
SELECT
    SUM(expected_cost) AS total_expected_cost
FROM decision_log;


-- 4. Average expected risk reduction
SELECT
    AVG(expected_risk_reduction) AS avg_expected_risk_reduction
FROM decision_log;


-- 5. Decisions by status
SELECT
    decision_status,
    COUNT(*) AS total_decisions
FROM decision_log
GROUP BY decision_status;


-- 6. Risk class with recommended actions
SELECT
    p.predicted_risk_class,
    r.action,
    COUNT(*) AS total_records
FROM predictions p
JOIN prescriptive_recommendations r
    ON p.record_id = r.record_id
GROUP BY
    p.predicted_risk_class,
    r.action
ORDER BY
    p.predicted_risk_class,
    total_records DESC;


-- 7. Average confidence by predicted risk
SELECT
    predicted_risk_class,
    AVG(prediction_confidence) AS avg_confidence
FROM predictions
GROUP BY predicted_risk_class;


-- 8. Supplier country risk analysis
SELECT
    s.supplier_country,
    p.predicted_risk_class,
    COUNT(*) AS total_records
FROM supply_chain_data s
JOIN predictions p
    ON s.record_id = p.record_id
GROUP BY
    s.supplier_country,
    p.predicted_risk_class
ORDER BY total_records DESC;


-- 9. Average action cost by recommendation
SELECT
    action,
    AVG(action_cost) AS avg_action_cost,
    AVG(risk_reduction) AS avg_risk_reduction
FROM prescriptive_recommendations
GROUP BY action;


-- 10. Complete decision view
SELECT
    s.record_id,
    s.supplier_id,
    s.supplier_country,
    p.predicted_risk_class,
    p.prediction_confidence,
    r.action AS recommended_action,
    r.action_cost,
    r.risk_reduction,
    d.decision_status
FROM supply_chain_data s
JOIN predictions p
    ON s.record_id = p.record_id
JOIN prescriptive_recommendations r
    ON s.record_id = r.record_id
JOIN decision_log d
    ON r.recommendation_id = d.recommendation_id
LIMIT 100;