import React from "react";

const COLORS = {
  pending: "#f59e0b",
  verified: "#3b82f6",
  assigned: "#8b5cf6",
  "in-progress": "#06b6d4",
  completed: "#22c55e",
};

export default function StatusBadge({ status }) {
  const color = COLORS[status] || "#64748b";
  return (
    <span className="status-badge" style={{ backgroundColor: color }}>
      {status}
    </span>
  );
}
