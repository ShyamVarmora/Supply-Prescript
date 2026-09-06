import os
from typing import Any

import mysql.connector
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
# DATABASE CONFIGURATION
# ============================================================

def get_db_connection():
    """Create a MySQL database connection."""

    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "root123"),
            database=os.getenv(
                "DB_NAME",
                "supply_prescript_db",
            ),
        )

    except mysql.connector.Error as exc:
        raise RuntimeError(
            f"Database connection failed: {exc}"
        ) from exc


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

    # Optional so the existing /recommend request
    # remains compatible while DB-backed recommendations
    # can use a real supply-chain record.
    record_id: int | None = Field(default=None, gt=0)


# ============================================================
# DECISION WRITE-BACK INPUT
# ============================================================

class DecisionRequest(BaseModel):
    record_id: int = Field(..., gt=0)
    recommendation_id: int = Field(..., gt=0)
    selected_action: str = Field(..., min_length=1, max_length=100)

    decision_status: str = Field(
        default="SELECTED",
        min_length=1,
        max_length=50,
    )


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
    connection = None
    cursor = None

    try:
        request_data = request.model_dump()

        # ----------------------------------------------------
        # 1. Validate record_id when DB-backed write-back
        #    is requested.
        # ----------------------------------------------------

        if request.record_id is not None:
            try:
                connection = get_db_connection()
                cursor = connection.cursor(dictionary=True)

                cursor.execute(
                    """
                    SELECT record_id
                    FROM supply_chain_data
                    WHERE record_id = %s
                    """,
                    (request.record_id,),
                )

                record = cursor.fetchone()

                if record is None:
                    raise HTTPException(
                        status_code=404,
                        detail=(
                            f"Supply-chain record "
                            f"{request.record_id} was not found."
                        ),
                    )

            except HTTPException:
                raise

            except RuntimeError as exc:
                raise HTTPException(
                    status_code=503,
                    detail=str(exc),
                )

        # ----------------------------------------------------
        # 2. Prepare shipment features for XGBoost
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
        # 3. Predict shipment delay
        # ----------------------------------------------------

        predicted_delay = predict_shipment_delay(
            shipment_data
        )

        # ----------------------------------------------------
        # 4. Build optimization scenario
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
        # 5. Run constrained optimization
        # ----------------------------------------------------

        result = optimize_alternatives(scenario)

        # ----------------------------------------------------
        # 6. Store generated recommendations when a real
        #    supply-chain record was supplied.
        # ----------------------------------------------------

        if request.record_id is not None:
            if connection is None:
                raise HTTPException(
                    status_code=503,
                    detail="Database connection is unavailable.",
                )

            if cursor is None:
                cursor = connection.cursor(dictionary=True)

            alternatives = result.get("alternatives", [])

            for alternative in alternatives:
                cursor.execute(
                    """
                    INSERT INTO prescriptive_recommendations (
                        record_id,
                        recommendation_rank,
                        action,
                        action_cost,
                        risk_reduction,
                        time_saved_days,
                        capacity_required,
                        operational_impact,
                        optimization_score,
                        budget_valid,
                        time_valid,
                        capacity_valid,
                        all_constraints_satisfied
                    )
                    VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s
                    )
                    """,
                    (
                        request.record_id,
                        alternative["option"],
                        alternative["action"],
                        alternative["cost"],

                        # No defined source/formula currently exists
                        # for risk_reduction.
                        None,

                        # No defined source/formula currently exists
                        # for time_saved_days.
                        None,

                        alternative["capacity"],
                        alternative["expected_impact"],
                        alternative["expected_impact"],
                        alternative["cost"]
                        <= request_data["budget"],
                        alternative["time"]
                        <= request_data["allowed_time"],
                        alternative["capacity"]
                        <= request_data["available_capacity"],
                        alternative["feasibility"]
                        == "feasible",
                    ),
                )

            connection.commit()

            # Retrieve the real auto-generated IDs.
            cursor.execute(
                """
                SELECT
                    recommendation_id,
                    recommendation_rank,
                    action,
                    action_cost,
                    risk_reduction,
                    time_saved_days,
                    capacity_required,
                    operational_impact,
                    optimization_score,
                    all_constraints_satisfied
                FROM prescriptive_recommendations
                WHERE record_id = %s
                ORDER BY recommendation_id DESC
                LIMIT %s
                """,
                (
                    request.record_id,
                    len(alternatives),
                ),
            )

            stored_recommendations = cursor.fetchall()

            result["stored_recommendations"] = (
                list(reversed(stored_recommendations))
            )

        # ----------------------------------------------------
        # 7. Return prediction + recommendations
        # ----------------------------------------------------

        return {
            "record_id": request.record_id,
            "prediction": {
                "target": "delivery_time_deviation",
                "predicted_delay": predicted_delay,
            },
            "optimization": result,
        }

    except HTTPException:
        raise

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

    except mysql.connector.Error as exc:
        if connection is not None:
            connection.rollback()

        print(
            f"DATABASE ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=503,
            detail="Database operation failed.",
        )

    except Exception as exc:
        if connection is not None:
            connection.rollback()

        print(
            f"OPTIMIZATION ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Prescriptive optimization failed.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()


# ============================================================
# DECISION WRITE-BACK
# ============================================================

@app.post("/decisions")
def create_decision(
    decision: DecisionRequest,
):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # ----------------------------------------------------
        # 1. Validate record_id
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT record_id
            FROM supply_chain_data
            WHERE record_id = %s
            """,
            (decision.record_id,),
        )

        record = cursor.fetchone()

        if record is None:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Supply-chain record "
                    f"{decision.record_id} was not found."
                ),
            )

        # ----------------------------------------------------
        # 2. Validate recommendation_id belongs to record_id
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                recommendation_id,
                record_id,
                action,
                action_cost,
                risk_reduction,
                time_saved_days
            FROM prescriptive_recommendations
            WHERE recommendation_id = %s
              AND record_id = %s
            """,
            (
                decision.recommendation_id,
                decision.record_id,
            ),
        )

        recommendation = cursor.fetchone()

        if recommendation is None:
            raise HTTPException(
                status_code=404,
                detail=(
                    "Recommendation was not found for "
                    "the supplied record."
                ),
            )

        # ----------------------------------------------------
        # 3. Validate selected action against the stored
        #    recommendation.
        # ----------------------------------------------------

        if decision.selected_action != recommendation["action"]:
            raise HTTPException(
                status_code=422,
                detail=(
                    "selected_action does not match "
                    "the stored recommendation."
                ),
            )

        # ----------------------------------------------------
        # 4. Insert decision into decision_log
        # ----------------------------------------------------

        cursor.execute(
            """
            INSERT INTO decision_log (
                record_id,
                recommendation_id,
                selected_action,
                expected_cost,
                expected_risk_reduction,
                expected_time_saved_days,
                decision_status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                decision.record_id,
                decision.recommendation_id,
                decision.selected_action,
                recommendation["action_cost"],
                None,
                None,
                decision.decision_status,
            ),
        )

        connection.commit()

        decision_id = cursor.lastrowid

        return {
            "status": "success",
            "decision_id": decision_id,
            "record_id": decision.record_id,
            "recommendation_id": decision.recommendation_id,
            "selected_action": decision.selected_action,
            "decision_status": decision.decision_status,
        }

    except HTTPException:
        raise

    except mysql.connector.Error as exc:
        if connection is not None:
            connection.rollback()

        print(
            f"DATABASE ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=503,
            detail="Database operation failed.",
        )

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        )

    except Exception as exc:
        if connection is not None:
            connection.rollback()

        print(
            f"DECISION ERROR: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Decision write-back failed.",
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()