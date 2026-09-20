import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero card">
        <h1>Smart Waste Management System</h1>
        <p>
          Connecting citizens, administrators and collection staff to report, prioritize,
          assign and track overflowing public waste bins — with a route planner to help
          organize collection.
        </p>
        {!user && (
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        )}
      </div>

      <div className="feature-grid">
        <div className="card feature">
          <h3>📍 Report Overflows</h3>
          <p>Citizens submit a report with description, location and severity in seconds.</p>
        </div>
        <div className="card feature">
          <h3>✅ Review & Assign</h3>
          <p>Admins verify reports, set priority and assign them to collection staff.</p>
        </div>
        <div className="card feature">
          <h3>🚚 Route Planning</h3>
          <p>A nearest-neighbor route planner suggests a practical collection order.</p>
        </div>
        <div className="card feature">
          <h3>📊 Analytics</h3>
          <p>A live dashboard tracks pending, assigned and completed collection work.</p>
        </div>
      </div>
    </div>
  );
}
