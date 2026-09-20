import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PRIORITY_COLORS = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444" };

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/analytics")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load analytics"));
  }, []);

  if (error) return <div className="page"><div className="alert-error">{error}</div></div>;
  if (!data) return <div className="page">Loading...</div>;

  const totalsData = [
    { name: "Pending", value: data.totals.pending },
    { name: "Verified", value: data.totals.verified },
    { name: "Assigned", value: data.totals.assigned },
    { name: "In Progress", value: data.totals.inProgress },
    { name: "Completed", value: data.totals.completed },
  ];

  const priorityData = Object.entries(data.priorityDistribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="page">
      <h2>Analytics Dashboard</h2>

      <div className="stat-grid">
        <div className="card stat"><span>{data.totals.total}</span><label>Total Reports</label></div>
        <div className="card stat"><span>{data.totals.pending}</span><label>Pending</label></div>
        <div className="card stat"><span>{data.totals.assigned + data.totals.inProgress}</span><label>Assigned/In Progress</label></div>
        <div className="card stat"><span>{data.totals.completed}</span><label>Completed</label></div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3>Report Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={totalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" outerRadius={90} label>
                {priorityData.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Area-wise Reports</h3>
        {data.areaWiseReports.length === 0 && <p className="hint">No location data yet.</p>}
        <ul className="simple-list">
          {data.areaWiseReports.map((a) => (
            <li key={a.area}>{a.area}: <strong>{a.count}</strong></li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Collection Activity by Staff</h3>
        {data.collectionActivity.length === 0 && <p className="hint">No completed tasks yet.</p>}
        <ul className="simple-list">
          {data.collectionActivity.map((s) => (
            <li key={s.name}>{s.name}: <strong>{s.completedCount}</strong> completed</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
