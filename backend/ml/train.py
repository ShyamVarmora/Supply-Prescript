from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor


BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "dynamic_supply_chain_logistics_dataset_with_country.csv"
)

MODEL_PATH = BASE_DIR / "models" / "shipment_delay_model.joblib"

TARGET = "delivery_time_deviation"


def main():
    print("=" * 60)
    print("SHIPMENT DELAY PREDICTIVE BASELINE")
    print("=" * 60)

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    print(f"Dataset: {DATA_PATH}")
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    if TARGET not in df.columns:
        raise ValueError(
            f"Target '{TARGET}' not found."
        )

    df = df.dropna(subset=[TARGET])

    y = df[TARGET]

    X = df.drop(columns=[TARGET])

    X = X.drop(
        columns=[
            "product_id",
            "supplier_id",
            "delay_probability",
            "disruption_likelihood_score",
            "risk_classification",
        ],
        errors="ignore",
    )

    categorical_features = X.select_dtypes(
        include=["object"]
    ).columns.tolist()

    numerical_features = X.select_dtypes(
        exclude=["object"]
    ).columns.tolist()

    print(f"\nTarget: {TARGET}")
    print(f"Numerical features: {len(numerical_features)}")
    print(f"Categorical features: {len(categorical_features)}")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

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
        [
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    print("\nTraining XGBoost...")

    pipeline.fit(X_train, y_train)

    print("Training completed.")

    predictions = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    print("\n" + "=" * 60)
    print("EVALUATION RESULTS")
    print("=" * 60)
    print(f"Model : XGBoost Regressor")
    print(f"Target: {TARGET}")
    print(f"MAE   : {mae:.4f}")
    print(f"RMSE  : {rmse:.4f}")
    print(f"R2    : {r2:.4f}")

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

    joblib.dump(pipeline, MODEL_PATH)

    print(f"\nModel saved: {MODEL_PATH}")


if __name__ == "__main__":
    main()