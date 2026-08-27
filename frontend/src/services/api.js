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
    throw new Error(
      `Unable to connect to the backend: ${error.message}`
    );
  }
}

// Prediction/recommendation API placeholder.
// The real backend prediction and optimization solver
// endpoint is still being completed.
//
// Do not invent an endpoint or response structure here.
// This function will be updated when the backend contract
// is provided.
export async function getPredictionRecommendations() {
  return null;
}

// Evaluation/ROI API placeholder.
// Real evaluation data will be connected when the
// backend evaluation endpoint is available.
export async function getDecisionROI() {
  return null;
}