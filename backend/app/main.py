import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ml.predict import load_model


app = FastAPI(
    title="Supply Prescript API",
    description="Predictive shipment-delay baseline API",
    version="1.0.0",
)


# ============================================================
# INPUT SCHEMA
# ============================================================

class ShipmentPredictionInput(BaseModel):
    warehouse_inventory_level: float
    handling_equipment_availability: float
    order_fulfillment_status: float
    weather_condition_severity: float
    shipping_costs: float
    supplier_reliability_score: float
    lead_time_days: float
    historical_demand: float
    cargo_condition_status: float
    route_risk_level: float
    customs_clearance_time: float
    supplier_country: str


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# ============================================================
# SHIPMENT DELAY PREDICTION
# ============================================================

@app.post("/predict/shipment-delay")
def predict_shipment_delay(
    shipment: ShipmentPredictionInput,
):
    try:
        model = load_model()

        input_data = pd.DataFrame(
            [
                {
                    "warehouse_inventory_level":
                        shipment.warehouse_inventory_level,

                    "handling_equipment_availability":
                        shipment.handling_equipment_availability,

                    "order_fulfillment_status":
                        shipment.order_fulfillment_status,

                    "weather_condition_severity":
                        shipment.weather_condition_severity,

                    "shipping_costs":
                        shipment.shipping_costs,

                    "supplier_reliability_score":
                        shipment.supplier_reliability_score,

                    "lead_time_days":
                        shipment.lead_time_days,

                    "historical_demand":
                        shipment.historical_demand,

                    "cargo_condition_status":
                        shipment.cargo_condition_status,

                    "route_risk_level":
                        shipment.route_risk_level,

                    "customs_clearance_time":
                        shipment.customs_clearance_time,

                    "supplier_country":
                        shipment.supplier_country,
                }
            ]
        )

        prediction = model.predict(input_data)

        return {
            "prediction_target": "delivery_time_deviation",
            "predicted_delivery_time_deviation": float(
                prediction[0]
            ),
        }

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Shipment-delay model is unavailable.",
        ) from exc

    except Exception as exc:
        print(
            f"PREDICTION ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"Prediction failed: "
                f"{type(exc).__name__}: {exc}"
            ),
        ) from exc