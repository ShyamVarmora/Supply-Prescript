const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Unable to connect to the backend: ${error.message}`);
  }
}

/*
 * Prediction / recommendation API integration boundary.
 *
 * The backend prediction endpoint and response contract
 * are not available yet, so no endpoint is guessed here.
 *
 * Once the backend contract is finalized, this function
 * will call the real prediction endpoint and return the
 * recommendation response to the UI.
 */
export async function getPredictionRecommendations() {
  throw new Error("Prediction API is not available yet");
}

/*
 * ROI integration is still pending.
 * No fake evaluation data is returned.
 */
export async function getDecisionROI() {
  return null;
}