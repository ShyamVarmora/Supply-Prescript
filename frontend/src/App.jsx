import "./App.css";

function App() {
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
      </main>
    </div>
  );
}

export default App;