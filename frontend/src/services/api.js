const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/health`
    );

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to connect to the backend.",
      { cause: error }
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

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to generate shipment prediction.",
      { cause: error }
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

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to load recommendations.",
      { cause: error }
    );
  }
}

export async function executeDecision(
  decision
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(decision),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to execute decision.",
      { cause: error }
    );
  }
}

export async function recordDecisionOutcome(
  decisionId,
  outcome
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions/${decisionId}/outcome`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outcome),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to record decision outcome.",
      { cause: error }
    );
  }
}

export async function getDecisionEvaluation(
  decisionId
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions/${decisionId}/evaluation`
    );

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to load decision evaluation.",
      { cause: error }
    );
  }
}

export async function getDecisionHistory() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions/history`
    );

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to load decision history.",
      { cause: error }
    );
  }
}

export async function getRoiAnalytics() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions/analytics/roi`
    );

    return await parseResponse(response);
  } catch (error) {
    throw new Error(
      error?.message ||
        "Unable to load ROI analytics.",
      { cause: error }
    );
  }
}