from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "dynamic_supply_chain_logistics_dataset_with_country.csv"
)

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "shipment_delay_model.joblib"
)


# ============================================================
# MODEL CONTRACT
# ============================================================

# Prediction target:
# Delivery-time deviation from the expected delivery time.
TARGET = "delivery_time_deviation"


# Features approved for the baseline.
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


# Fields deliberately excluded from model training.
EXCLUDED_FIELDS = [
    "product_id",
    "supplier_id",
    "delay_probability",
    "risk_classification",
    "disruption_likelihood_score",
]


# ============================================================
# DATA LOADING
# ============================================================

def load_dataset() -> pd.DataFrame:
    """Load Mansi's processed historical supply-chain dataset."""

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found:\n{DATA_PATH}"
        )

    data = pd.read_csv(DATA_PATH)

    if data.empty:
        raise ValueError("The dataset is empty.")

    print(f"Dataset: {DATA_PATH}")
    print(f"Rows: {len(data)}")
    print(f"Columns: {len(data.columns)}")

    return data


# ============================================================
# DATA PREPARATION
# ============================================================

def prepare_data(data: pd.DataFrame):
    """Prepare approved features and shipment-delay target."""

    # Check target
    if TARGET not in data.columns:
        raise ValueError(
            f"Target column '{TARGET}' was not found.\n"
            f"Available columns:\n{list(data.columns)}"
        )

    # Check approved features
    missing_features = [
        feature
        for feature in APPROVED_FEATURES
        if feature not in data.columns
    ]

    if missing_features:
        raise ValueError(
            f"Approved features missing from dataset: "
            f"{missing_features}"
        )

    # Select only explicitly approved features.
    X = data[APPROVED_FEATURES].copy()

    # Target
    y = data[TARGET].copy()

    # Remove rows with missing target.
    valid_rows = y.notna()

    X = X.loc[valid_rows]
    y = y.loc[valid_rows]

    return X, y


# ============================================================
# TRAINING
# ============================================================

def train_model(X, y):

    categorical_features = X.select_dtypes(
        include=["object", "string"]
    ).columns.tolist()

    numerical_features = X.select_dtypes(
        exclude=["object", "string"]
    ).columns.tolist()

    print(
        f"\nNumerical features: "
        f"{len(numerical_features)}"
    )

    print(
        f"Categorical features: "
        f"{len(categorical_features)}"
    )

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

    print(
        f"\nTraining samples: {len(X_train)}"
    )

    print(
        f"Testing samples: {len(X_test)}"
    )

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=False,
                ),
                categorical_features,
            ),
            (
                "numerical",
                "passthrough",
                numerical_features,
            ),
        ]
    )

    # XGBoost regression model
    model = XGBRegressor(
        objective="reg:squarederror",
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    print("\nTraining XGBoost...")

    pipeline.fit(
        X_train,
        y_train,
    )

    print("Training completed.")

    # Predictions
    predictions = pipeline.predict(X_test)

    # Evaluation
    mae = mean_absolute_error(
        y_test,
        predictions,
    )

    rmse = mean_squared_error(
        y_test,
        predictions,
    ) ** 0.5

    r2 = r2_score(
        y_test,
        predictions,
    )

    return pipeline, mae, rmse, r2


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("SHIPMENT DELAY PREDICTIVE BASELINE")
    print("=" * 60)

    # Load dataset
    data = load_dataset()

    # Display target information
    print(f"\nPrediction target: {TARGET}")

    print("\nExcluded fields:")
    for field in EXCLUDED_FIELDS:
        print(f"  - {field}")

    print("\nApproved input features:")
    for feature in APPROVED_FEATURES:
        print(f"  - {feature}")

    # Prepare data
    X, y = prepare_data(data)

    print(
        f"\nRows used for training/evaluation: "
        f"{len(X)}"
    )

    # Train and evaluate
    pipeline, mae, rmse, r2 = train_model(
        X,
        y,
    )

    # ========================================================
    # RESULTS
    # ========================================================

    print("\n" + "=" * 60)
    print("EVALUATION RESULTS")
    print("=" * 60)

    print("Model : XGBoost Regressor")
    print(f"Target: {TARGET}")
    print(f"MAE   : {mae:.4f}")
    print(f"RMSE  : {rmse:.4f}")
    print(f"R2    : {r2:.4f}")

    # ========================================================
    # SAVE MODEL
    # ========================================================

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(
        pipeline,
        MODEL_PATH,
    )

    print("\nModel saved to:")
    print(MODEL_PATH)

    print("\nPredictive baseline completed successfully.")


if __name__ == "__main__":
    main()