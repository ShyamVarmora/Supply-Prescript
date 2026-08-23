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

// Pending backend integration.
// The actual evaluation endpoint will be added
// once the backend evaluation API is available.
export async function getDecisionROI() {
  throw new Error("Decision ROI endpoint is not available yet");
}