CREATE TABLE IF NOT EXISTS supply_chain_data (
    record_id BIGSERIAL PRIMARY KEY,
    warehouse_inventory_level DOUBLE PRECISION NOT NULL,
    handling_equipment_availability DOUBLE PRECISION NOT NULL,
    order_fulfillment_status DOUBLE PRECISION NOT NULL,
    weather_condition_severity DOUBLE PRECISION NOT NULL,
    shipping_costs DOUBLE PRECISION NOT NULL,
    supplier_reliability_score DOUBLE PRECISION NOT NULL,
    lead_time_days DOUBLE PRECISION NOT NULL,
    historical_demand DOUBLE PRECISION NOT NULL,
    cargo_condition_status DOUBLE PRECISION NOT NULL,
    route_risk_level DOUBLE PRECISION NOT NULL,
    customs_clearance_time DOUBLE PRECISION NOT NULL,
    supplier_country TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS predictions (
    prediction_id BIGSERIAL PRIMARY KEY,
    record_id BIGINT NOT NULL REFERENCES supply_chain_data(record_id),
    prediction_target TEXT NOT NULL,
    predicted_value DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptive_recommendations (
    recommendation_id BIGSERIAL PRIMARY KEY,
    record_id BIGINT NOT NULL REFERENCES supply_chain_data(record_id),
    recommendation_batch_id TEXT NOT NULL,
    recommendation_rank INTEGER NOT NULL,
    action TEXT NOT NULL,
    action_cost DOUBLE PRECISION NOT NULL,
    risk_reduction DOUBLE PRECISION,
    time_saved_days DOUBLE PRECISION,
    capacity_required DOUBLE PRECISION NOT NULL,
    operational_impact DOUBLE PRECISION NOT NULL,
    optimization_score DOUBLE PRECISION,
    budget_valid BOOLEAN NOT NULL,
    time_valid BOOLEAN NOT NULL,
    capacity_valid BOOLEAN NOT NULL,
    all_constraints_satisfied BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE prescriptive_recommendations
    ADD COLUMN IF NOT EXISTS recommendation_batch_id TEXT;

CREATE TABLE IF NOT EXISTS decision_log (
    decision_id BIGSERIAL PRIMARY KEY,
    record_id BIGINT NOT NULL REFERENCES supply_chain_data(record_id),
    recommendation_id BIGINT NOT NULL REFERENCES prescriptive_recommendations(recommendation_id),
    selected_action TEXT NOT NULL,
    expected_cost DOUBLE PRECISION NOT NULL,
    expected_risk_reduction DOUBLE PRECISION,
    expected_time_saved_days DOUBLE PRECISION,
    decision_status TEXT NOT NULL CHECK (decision_status = 'SELECTED'),
    retraining_triggered_at TIMESTAMPTZ,
    selected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE decision_log
    ADD COLUMN IF NOT EXISTS retraining_triggered_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS actual_outcomes (
    outcome_id BIGSERIAL PRIMARY KEY,
    decision_id BIGINT NOT NULL REFERENCES decision_log(decision_id),
    actual_cost DOUBLE PRECISION,
    actual_delay_days DOUBLE PRECISION,
    outcome_status TEXT,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recommendations_record_id
    ON prescriptive_recommendations(record_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_recommendations_batch_rank
    ON prescriptive_recommendations(recommendation_batch_id, recommendation_rank);
CREATE INDEX IF NOT EXISTS idx_decision_log_record_id
    ON decision_log(record_id);
CREATE INDEX IF NOT EXISTS idx_actual_outcomes_decision_id
    ON actual_outcomes(decision_id);