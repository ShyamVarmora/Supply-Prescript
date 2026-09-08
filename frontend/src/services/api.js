const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

async function getErrorMessage(response) {
  let message = `Backend returned ${response.status}`;

  try {
    const errorData = await response.json();

    if (errorData?.detail) {
      message = errorData.detail;
    } else if (errorData?.message) {
      message = errorData.message;
    }
  } catch {
    // Keep the default HTTP error message.
  }

  return message;
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/health`
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response)
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to connect to the backend: ${error.message}`,
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

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response)
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to load recommendations: ${error.message}`,
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

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response)
      );
    }

    const data = await response.json();

    if (
      !data ||
      data.status !== "success" ||
      data.decision_id == null
    ) {
      throw new Error(
        "Backend did not return a valid decision ID."
      );
    }

    return data;
  } catch (error) {
    throw new Error(
      `Unable to execute decision: ${error.message}`,
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

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response)
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Unable to record decision outcome: ${error.message}`,
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

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response)
      );
    }

    const data = await response.json();

    if (!data?.evaluation) {
      throw new Error(
        "Backend did not return evaluation data."
      );
    }

    return data.evaluation;
  } catch (error) {
    throw new Error(
      `Unable to load decision evaluation: ${error.message}`,
      { cause: error }
    );
  }
}

export async function getDecisionHistory() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/decisions/history`
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response)
      );
    }

    const data = await response.json();

    return Array.isArray(data?.decisions)
      ? data.decisions
      : [];
  } catch (error) {
    throw new Error(
      `Unable to load decision history: ${error.message}`,
      { cause: error }
    );
  }
}