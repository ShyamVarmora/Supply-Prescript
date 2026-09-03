from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.predict import predict_shipment_delay
from ml.optimizer import OptimizationInput, optimize_alternatives


app = FastAPI(
    title="Supply Prescript API",
    description="Predictive and prescriptive supply-chain API",
    version="1.1.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# SHIPMENT INPUT
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
# OPTIMIZATION INPUT
# ============================================================

class OptimizationRequest(BaseModel):
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

    budget: float = Field(..., ge=0)
    allowed_time: float = Field(..., ge=0)
    available_capacity: float = Field(..., ge=0)

    shipment_time: float = Field(..., gt=0)
    shipment_capacity: float = Field(..., gt=0)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {"status": "ok"}


# ============================================================
# SHIPMENT DELAY PREDICTION
# ============================================================

@app.post("/predict/shipment-delay")
def predict_shipment_delay_endpoint(
    shipment: ShipmentPredictionInput,
):
    try:
        prediction = predict_shipment_delay(
            shipment.model_dump()
        )

        return {
            "prediction_target": "delivery_time_deviation",
            "predicted_delivery_time_deviation": prediction,
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Shipment-delay model is unavailable.",
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    except Exception as exc:
        print(
            f"PREDICTION ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Shipment-delay prediction failed.",
        )


# ============================================================
# PRESCRIPTIVE RECOMMENDATION
# ============================================================

@app.post("/recommend")
def recommend_action(
    request: OptimizationRequest,
):
    try:
        request_data = request.model_dump()

        # ----------------------------------------------------
        # 1. Prepare shipment features for XGBoost
        # ----------------------------------------------------

        shipment_data = {
            key: request_data[key]
            for key in [
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
        }

        # ----------------------------------------------------
        # 2. Predict shipment delay
        # ----------------------------------------------------

        predicted_delay = predict_shipment_delay(
            shipment_data
        )

        # ----------------------------------------------------
        # 3. Build optimization scenario
        # ----------------------------------------------------

        scenario = OptimizationInput(
            budget=request_data["budget"],
            allowed_time=request_data["allowed_time"],
            available_capacity=request_data[
                "available_capacity"
            ],
            predicted_delay=predicted_delay,
            shipment_cost=request_data["shipping_costs"],
            shipment_time=request_data["shipment_time"],
            shipment_capacity=request_data[
                "shipment_capacity"
            ],
        )

        # ----------------------------------------------------
        # 4. Run constrained optimization
        # ----------------------------------------------------

        result = optimize_alternatives(scenario)

        # ----------------------------------------------------
        # 5. Return prediction + recommendations
        # ----------------------------------------------------

        return {
            "prediction": {
                "target": "delivery_time_deviation",
                "predicted_delay": predicted_delay,
            },
            "optimization": result,
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Shipment-delay model is unavailable.",
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    except Exception as exc:
        print(
            f"OPTIMIZATION ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Prescriptive optimization failed.",
        )