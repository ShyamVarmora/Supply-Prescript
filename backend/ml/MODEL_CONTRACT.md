# Shipment Delay Prediction Model Contract

## Prediction Flow

Shipment / supply-chain inputs
        ↓
Feature preparation
        ↓
XGBoost Regressor
        ↓
Predicted delivery-time deviation
        ↓
Future prescriptive decision engine


## Prediction Target

Target:

`delivery_time_deviation`

The model predicts the delivery-time deviation associated with a shipment.


## Model

Model type:

`XGBRegressor`

The predictive baseline uses regression because the selected target
`delivery_time_deviation` is a continuous numerical value.


## Input Features

The API accepts the following approved input features:

- `warehouse_inventory_level`
- `handling_equipment_availability`
- `order_fulfillment_status`
- `weather_condition_severity`
- `shipping_costs`
- `supplier_reliability_score`
- `lead_time_days`
- `historical_demand`
- `cargo_condition_status`
- `route_risk_level`
- `customs_clearance_time`
- `supplier_country`


## Excluded Fields

The following fields are excluded from model training:

- `product_id`
- `supplier_id`
- `delay_probability`
- `risk_classification`
- `disruption_likelihood_score`


## Reason for Exclusions

`product_id` and `supplier_id` are identifiers rather than approved
predictive shipment features.

`delay_probability`, `risk_classification`, and
`disruption_likelihood_score` are excluded to avoid using derived
risk/delay information that could introduce target leakage or duplicate
information already produced by the predictive process.


## API Contract

### Endpoint

`POST /predict/shipment-delay`

### Input

The request contains the 12 approved input features listed above.

Numeric fields are supplied as numbers.

`supplier_country` is supplied as a string.


### Output

The endpoint returns:

- `prediction_target`
- `predicted_delivery_time_deviation`

Example:

```json
{
  "prediction_target": "delivery_time_deviation",
  "predicted_delivery_time_deviation": 5.1234
}