import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

export default function AssignTask() {
  const [reports, setReports] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selections, setSelections] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [reportsRes, staffRes] = await Promise.all([
        api.get("/reports", { params: { status: "verified" } }),
        api.get("/assignments/staff-list"),
      ]);
      // Also show pending, since a small class project may skip a separate "verify" step
      const pendingRes = await api.get("/reports", { params: { status: "pending" } });
      setReports([...reportsRes.data.reports, ...pendingRes.data.reports]);
      setStaffList(staffRes.data.staff);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assign = async (reportId) => {
    const staffId = selections[reportId];
    if (!staffId) {
      setError("Select a staff member first");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.post("/assignments", { reportId, staffId });
      setMessage("Task assigned successfully");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <div className="page">
      <h2>Assign Reports to Collection Staff</h2>
      {error && <div className="alert-error">{error}</div>}
      {message && <div className="alert-success">{message}</div>}
      {loading && <p>Loading...</p>}

      {staffList.length === 0 && !loading && (
        <p className="hint">No staff accounts yet — have a staff member register first.</p>
      )}

      <div className="report-list">
        {reports.map((r) => (
          <div className="card report-item" key={r._id}>
            <div className="report-item-header">
              <strong>{r.description}</strong>
              <StatusBadge status={r.status} />
            </div>
            <div className="report-meta">
              <span>Priority: <strong>{r.priorityLevel}</strong></span>
              <span>Citizen: {r.citizen?.name}</span>
            </div>
            <div className="row" style={{ marginTop: 8 }}>
              <select
                value={selections[r._id] || ""}
                onChange={(e) => setSelections({ ...selections, [r._id]: e.target.value })}
              >
                <option value="">Select staff...</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              <button onClick={() => assign(r._id)}>Assign</button>
            </div>
          </div>
        ))}
        {!loading && reports.length === 0 && <p className="hint">No unassigned reports right now.</p>}
      </div>
    </div>
  );
}
