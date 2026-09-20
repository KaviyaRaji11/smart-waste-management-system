import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

const STATUS_OPTIONS = ["pending", "verified", "assigned", "in-progress", "completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reports", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setReports(data.reports);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/reports/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const changePriority = async (id, priorityLevel) => {
    try {
      await api.patch(`/reports/${id}/priority`, { priorityLevel });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update priority");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>All Reports</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {loading && <p>Loading...</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Citizen</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reported</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td className="col-desc">{r.description}</td>
                <td>{r.citizen?.name}</td>
                <td>{r.location?.address || (r.location?.lat ? `${r.location.lat}, ${r.location.lng}` : "—")}</td>
                <td>
                  <select value={r.priorityLevel} onChange={(e) => changePriority(r._id, e.target.value)}>
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
                <td>
                  <StatusBadge status={r.status} />
                  <select
                    value={r.status}
                    onChange={(e) => changeStatus(r._id, e.target.value)}
                    style={{ marginLeft: 8 }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && reports.length === 0 && <p className="hint">No reports found.</p>}
      </div>
    </div>
  );
}
