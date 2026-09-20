import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

const NEXT_STATUS = {
  assigned: "in-progress",
  "in-progress": "completed",
};

const NEXT_LABEL = {
  assigned: "Start Collection",
  "in-progress": "Mark Completed",
};

export default function MyTasks() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/staff/tasks");
      setAssignments(data.assignments);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advance = async (assignment) => {
    const next = NEXT_STATUS[assignment.taskStatus];
    if (!next) return;
    try {
      await api.patch(`/tasks/${assignment._id}/status`, { taskStatus: next });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="page">
      <h2>My Assigned Tasks</h2>
      {error && <div className="alert-error">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && assignments.length === 0 && <p className="hint">No tasks assigned to you yet.</p>}

      <div className="report-list">
        {assignments.map((a) => (
          <div className="card report-item" key={a._id}>
            <div className="report-item-header">
              <strong>{a.report?.description}</strong>
              <StatusBadge status={a.taskStatus} />
            </div>
            <div className="report-meta">
              <span>Priority: <strong>{a.report?.priorityLevel}</strong></span>
              <span>
                Location: {a.report?.location?.address ||
                  (a.report?.location?.lat ? `${a.report.location.lat}, ${a.report.location.lng}` : "Not provided")}
              </span>
              <span>Assigned: {new Date(a.createdAt).toLocaleString()}</span>
            </div>
            {NEXT_STATUS[a.taskStatus] && (
              <button style={{ marginTop: 8 }} onClick={() => advance(a)}>
                {NEXT_LABEL[a.taskStatus]}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
