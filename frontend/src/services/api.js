const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

export async function checkBackendHealth() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/health`
    );

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to connect to the backend: ${error.message}`
    );
  }
}

export async function getPredictionRecommendations(
  shipment
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/predict/shipment-delay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipment),
      }
    );

    if (!response.ok) {
      let message =
        `Backend returned ${response.status}`;

      try {
        const errorData =
          await response.json();

        if (errorData?.detail) {
          message = errorData.detail;
        }
      } catch {
        // Keep default HTTP error message.
      }

      throw new Error(message);
    }

    const data = await response.json();

    if (
      !data ||
      data.prediction_target !==
        "delivery_time_deviation" ||
      typeof data.predicted_delivery_time_deviation !==
        "number"
    ) {
      throw new Error(
        "Invalid prediction response from backend."
      );
    }

    return data;
  } catch (error) {
    throw new Error(
      `Unable to load shipment prediction: ${error.message}`
    );
  }
}

export async function getRecommendations(
  requestData
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/recommend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      let message =
        `Backend returned ${response.status}`;

      try {
        const errorData =
          await response.json();

        if (errorData?.detail) {
          message = errorData.detail;
        }
      } catch {
        // Keep default HTTP error message.
      }

      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to load recommendations: ${error.message}`
    );
  }
}

/*
 * Decision write-back endpoint.
 *
 * This is kept separate from the Week-3
 * evaluation/ROI UI.
 *
 * Do not invent or modify the request
 * contract until the backend endpoint
 * is confirmed.
 */
export async function executeDecision(
  recommendation
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(
          recommendation
        ),
      }
    );

    if (!response.ok) {
      let message =
        `Backend returned ${response.status}`;

      try {
        const errorData =
          await response.json();

        if (errorData?.detail) {
          message = errorData.detail;
        } else if (errorData?.message) {
          message = errorData.message;
        }
      } catch {
        // Keep default HTTP error message.
      }

      throw new Error(message);
    }

    const data = await response.json();

    if (!data) {
      throw new Error(
        "Backend did not confirm decision execution."
      );
    }

    return data;
  } catch (error) {
    throw new Error(
      `Unable to execute decision: ${error.message}`
    );
  }
}

/*
 * Week-3 decision evaluation API placeholder.
 *
 * The backend evaluation endpoint has not
 * been defined yet.
 *
 * Do not invent an endpoint or return
 * fake evaluation/ROI data.
 */
export async function getDecisionEvaluation() {
  return null;
}

/*
 * Week-3 decision history API placeholder.
 *
 * The backend history endpoint has not
 * been defined yet.
 *
 * Do not invent an endpoint or return
 * fake decision history.
 */
export async function getDecisionHistory() {
  return [];
}