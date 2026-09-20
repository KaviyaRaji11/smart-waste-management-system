import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🗑️ Smart Waste Management</Link>
      </div>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === "citizen" && (
          <>
            <Link to="/citizen/report">New Report</Link>
            <Link to="/citizen/my-reports">My Reports</Link>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link to="/admin/reports">All Reports</Link>
            <Link to="/admin/assign">Assign</Link>
            <Link to="/admin/routes">Route Optimizer</Link>
            <Link to="/admin/analytics">Analytics</Link>
          </>
        )}
        {user && user.role === "staff" && <Link to="/staff/tasks">My Tasks</Link>}
        {user && (
          <span className="navbar-user">
            {user.name} ({user.role})
            <button onClick={handleLogout} className="btn-link">
              Logout
            </button>
          </span>
        )}
      </div>
    </nav>
  );
}
