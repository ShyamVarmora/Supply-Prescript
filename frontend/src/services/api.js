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
      let message = `Backend returned ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData?.detail) {
          message = errorData.detail;
        }
      } catch {
        // Keep the default HTTP error message.
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

/*
 * Recommendation API placeholder.
 *
 * Update RECOMMENDATION_ENDPOINT when Chetan confirms
 * the backend solver contract.
 */
export async function getRecommendations(shipment) {
  const RECOMMENDATION_ENDPOINT = null;

  if (!RECOMMENDATION_ENDPOINT) {
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${RECOMMENDATION_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipment),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}`
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.recommendations)) {
      return data.recommendations;
    }

    return [];
  } catch (error) {
    throw new Error(
      `Unable to load recommendations: ${error.message}`
    );
  }
}

/*
 * Real evaluation/ROI endpoint is not available yet.
 */
export async function getDecisionROI() {
  return null;
}