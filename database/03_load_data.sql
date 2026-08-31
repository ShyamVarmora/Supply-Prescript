-- =====================================================
-- SupplyPrescript Data Loading
-- =====================================================

USE supply_prescript_db;

-- =====================================================
-- Load cleaned supply chain dataset
-- =====================================================

LOAD DATA INFILE
'C:/ProgramData/MySQL/MySQL Server 9.2/Uploads/supply_chain_cleaned.csv'
INTO TABLE supply_chain_data
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(
    warehouse_inventory_level,
    handling_equipment_availability,
    order_fulfillment_status,
    weather_condition_severity,
    shipping_costs,
    supplier_reliability_score,
    lead_time_days,
    historical_demand,
    cargo_condition_status,
    route_risk_level,
    customs_clearance_time,
    disruption_likelihood_score,
    delay_probability,
    risk_classification,
    delivery_time_deviation,
    product_id,
    supplier_id,
    supplier_country
);

-- =====================================================
-- Load prediction results
-- =====================================================

LOAD DATA INFILE
'C:/ProgramData/MySQL/MySQL Server 9.2/Uploads/predictions.csv'
INTO TABLE predictions
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(
    record_id,
    predicted_risk_class,
    prediction_confidence,
    predicted_delay_probability,
    model_name,
    model_version
);

-- =====================================================
-- Load prescriptive recommendations
-- =====================================================

SET @row_number = 0;

LOAD DATA INFILE
'C:/ProgramData/MySQL/MySQL Server 9.2/Uploads/prescriptive_recommendations.csv'
INTO TABLE prescriptive_recommendations
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(
    @warehouse_inventory_level,
    @handling_equipment_availability,
    @order_fulfillment_status,
    @weather_condition_severity,
    @shipping_costs,
    @supplier_reliability_score,
    @lead_time_days,
    @historical_demand,
    @cargo_condition_status,
    @route_risk_level,
    @customs_clearance_time,
    @disruption_likelihood_score,
    @delay_probability,
    @risk_classification,
    @delivery_time_deviation,
    @product_id,
    @supplier_id,
    @supplier_country,
    @predicted_risk,
    @prediction_confidence,
    @risk_score,
    @risk_exposure,
    @recommended_action,
    @recommended_action_cost,
    @recommended_risk_reduction,
    @recommended_operational_impact,
    @expected_risk_reduced,
    @expected_remaining_risk
)
SET
    record_id = (@row_number := @row_number + 1),
    recommendation_rank = 1,
    action = @recommended_action,
    action_cost = @recommended_action_cost,
    risk_reduction = @recommended_risk_reduction,
    operational_impact = @recommended_operational_impact;

    -- =====================================================
-- Populate Decision Log
-- =====================================================

INSERT INTO decision_log (
    record_id,
    recommendation_id,
    selected_action,
    expected_cost,
    expected_risk_reduction,
    expected_time_saved_days,
    decision_status
)
SELECT
    record_id,
    recommendation_id,
    action,
    action_cost,
    risk_reduction,
    time_saved_days,
    'PENDING'
FROM prescriptive_recommendations;