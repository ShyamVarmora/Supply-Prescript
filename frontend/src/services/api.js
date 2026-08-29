const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function getErrorMessage(response) {
  try {
    const errorData = await response.json();

    if (errorData?.detail) {
      return typeof errorData.detail === "string"
        ? errorData.detail
        : JSON.stringify(errorData.detail);
    }
  } catch {
    // Ignore JSON parsing errors.
  }

  return `Backend returned ${response.status}`;
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to connect to the backend: ${error.message}`
    );
  }
}

export async function getPredictionRecommendations(shipment) {
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
      throw new Error(await getErrorMessage(response));
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to load shipment prediction: ${error.message}`
    );
  }
}

export async function getRecommendations(requestData) {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const data = await response.json();

    if (!data?.optimization) {
      throw new Error("Invalid recommendation response from backend.");
    }

    return data;
  } catch (error) {
    throw new Error(
      `Unable to load recommendations: ${error.message}`
    );
  }
}

// Mansi's decision write-back endpoint is not available yet.
// Do not invent an endpoint.
export async function executeDecision() {
  throw new Error(
    "Decision write-back endpoint is not available yet."
  );
}

// Real evaluation/ROI endpoint is not available yet.
export async function getDecisionROI() {
  return null;
}