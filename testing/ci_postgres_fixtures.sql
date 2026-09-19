-- CI-only PostgreSQL fixtures for backend/tests/test_real_postgres.py.
-- These rows provide deterministic record_id values 1 and 2 on a clean CI DB.

INSERT INTO supply_chain_data (
    record_id,
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
    supplier_country
)
VALUES
    (1, 850.0, 0.90, 0.95, 0.20, 420.0, 0.92, 8.0, 640.0, 0.95, 0.15, 2.0, 'Greece'),
    (2, 620.0, 0.80, 0.88, 0.35, 560.0, 0.85, 11.0, 510.0, 0.90, 0.25, 3.0, 'Germany')
ON CONFLICT (record_id) DO UPDATE SET
    warehouse_inventory_level = EXCLUDED.warehouse_inventory_level,
    handling_equipment_availability = EXCLUDED.handling_equipment_availability,
    order_fulfillment_status = EXCLUDED.order_fulfillment_status,
    weather_condition_severity = EXCLUDED.weather_condition_severity,
    shipping_costs = EXCLUDED.shipping_costs,
    supplier_reliability_score = EXCLUDED.supplier_reliability_score,
    lead_time_days = EXCLUDED.lead_time_days,
    historical_demand = EXCLUDED.historical_demand,
    cargo_condition_status = EXCLUDED.cargo_condition_status,
    route_risk_level = EXCLUDED.route_risk_level,
    customs_clearance_time = EXCLUDED.customs_clearance_time,
    supplier_country = EXCLUDED.supplier_country;

SELECT setval(
    pg_get_serial_sequence('supply_chain_data', 'record_id'),
    GREATEST((SELECT MAX(record_id) FROM supply_chain_data), 2),
    true
);