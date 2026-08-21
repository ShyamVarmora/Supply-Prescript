import { useState } from "react";
import { checkBackendHealth } from "./services/api";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Not checked");

  const testBackendConnection = async () => {
    setBackendStatus("Checking...");

    try {
      const result = await checkBackendHealth();

      if (result.status === "ok") {
        setBackendStatus("Backend connected");
      } else {
        setBackendStatus("Unexpected backend response");
      }
    } catch (error) {
      setBackendStatus("Backend unavailable");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Supply Prescript</h1>
        <p>Supply chain decision support</p>
      </header>

      <main className="app-content">
        <section className="section">
          <h2>Shipment Risk</h2>
        </section>

        <section className="section">
          <h2>Recommendations</h2>
        </section>

        <section className="section">
          <h2>Decision</h2>
        </section>

        <section className="section">
          <h2>Feedback</h2>
        </section>

        <section className="section">
          <h2>Backend Connection</h2>

          <p>{backendStatus}</p>

          <button type="button" onClick={testBackendConnection}>
            Test Backend Connection
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;