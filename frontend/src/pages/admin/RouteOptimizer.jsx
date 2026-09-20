import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function RouteOptimizer() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/reports").then(({ data }) => {
      // Only reports with coordinates are useful for route generation
      setReports(data.reports.filter((r) => typeof r.location?.lat === "number"));
    });
  }, []);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const generate = async () => {
    setError("");
    setResult(null);
    if (selected.length === 0) {
      setError("Select at least one report with a location.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/routes/optimize", { reportIds: selected });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate route");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <h2>Route Optimizer</h2>
      {error && <div className="alert-error">{error}</div>}

      <div className="card">
        <h3>Select locations to include</h3>
        {reports.length === 0 && <p className="hint">No reports with coordinates yet.</p>}
        <div className="checkbox-list">
          {reports.map((r) => (
            <label key={r._id} className="checkbox-row">
              <input
                type="checkbox"
                checked={selected.includes(r._id)}
                onChange={() => toggle(r._id)}
              />
              {r.location.address || r.description.slice(0, 40)} ({r.location.lat}, {r.location.lng})
            </label>
          ))}
        </div>
        <button onClick={generate} disabled={busy}>{busy ? "Calculating..." : "Generate Route"}</button>
      </div>

      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Suggested Collection Order</h3>
          <p>Estimated total distance: <strong>{result.totalDistanceKm} km</strong></p>
          <ol>
            {result.order.map((p, i) => (
              <li key={p.id}>{p.name} ({p.lat}, {p.lng})</li>
            ))}
          </ol>
          {result.skippedNoCoordinates?.length > 0 && (
            <p className="hint">{result.skippedNoCoordinates.length} report(s) skipped — no coordinates on file.</p>
          )}
          <p className="hint">{result.note}</p>
        </div>
      )}
    </div>
  );
}
