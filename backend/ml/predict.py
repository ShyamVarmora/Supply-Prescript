from pathlib import Path

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "shipment_delay_model.joblib"


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. Run train.py first."
        )

    return joblib.load(MODEL_PATH)


def predict_shipment_delay(shipment_input):
    model = load_model()

    if not isinstance(shipment_input, pd.DataFrame):
        shipment_input = pd.DataFrame(shipment_input)

    return model.predict(shipment_input)


if __name__ == "__main__":
    if MODEL_PATH.exists():
        print(f"Model loaded: {MODEL_PATH}")
    else:
        print("Model not found. Run train.py first.")