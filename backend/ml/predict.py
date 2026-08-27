from pathlib import Path

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "shipment_delay_model.joblib"


APPROVED_FEATURES = [
    "warehouse_inventory_level",
    "handling_equipment_availability",
    "order_fulfillment_status",
    "weather_condition_severity",
    "shipping_costs",
    "supplier_reliability_score",
    "lead_time_days",
    "historical_demand",
    "cargo_condition_status",
    "route_risk_level",
    "customs_clearance_time",
    "supplier_country",
]


def load_model():
    """Load the trained shipment-delay model."""

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Trained shipment-delay model not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def predict_shipment_delay(shipment_input):
    """Predict delivery-time deviation for a shipment."""

    model = load_model()

    if isinstance(shipment_input, dict):
        shipment_input = pd.DataFrame([shipment_input])

    elif not isinstance(shipment_input, pd.DataFrame):
        shipment_input = pd.DataFrame(shipment_input)

    missing_features = [
        feature
        for feature in APPROVED_FEATURES
        if feature not in shipment_input.columns
    ]

    if missing_features:
        raise ValueError(
            f"Missing required features: {missing_features}"
        )

    shipment_input = shipment_input[APPROVED_FEATURES]

    prediction = model.predict(shipment_input)

    return float(prediction[0])


if __name__ == "__main__":
    try:
        load_model()
        print(f"Model loaded successfully: {MODEL_PATH}")
    except FileNotFoundError as exc:
        print(exc)