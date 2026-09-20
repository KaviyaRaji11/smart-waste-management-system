import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateReport from "./pages/citizen/CreateReport";
import MyReports from "./pages/citizen/MyReports";
import AllReports from "./pages/admin/AllReports";
import AssignTask from "./pages/admin/AssignTask";
import RouteOptimizer from "./pages/admin/RouteOptimizer";
import Analytics from "./pages/admin/Analytics";
import MyTasks from "./pages/staff/MyTasks";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/citizen/report"
            element={<PrivateRoute roles={["citizen"]}><CreateReport /></PrivateRoute>}
          />
          <Route
            path="/citizen/my-reports"
            element={<PrivateRoute roles={["citizen"]}><MyReports /></PrivateRoute>}
          />

          <Route
            path="/admin/reports"
            element={<PrivateRoute roles={["admin"]}><AllReports /></PrivateRoute>}
          />
          <Route
            path="/admin/assign"
            element={<PrivateRoute roles={["admin"]}><AssignTask /></PrivateRoute>}
          />
          <Route
            path="/admin/routes"
            element={<PrivateRoute roles={["admin"]}><RouteOptimizer /></PrivateRoute>}
          />
          <Route
            path="/admin/analytics"
            element={<PrivateRoute roles={["admin"]}><Analytics /></PrivateRoute>}
          />

          <Route
            path="/staff/tasks"
            element={<PrivateRoute roles={["staff"]}><MyTasks /></PrivateRoute>}
          />

          <Route path="*" element={<div className="page">Page not found.</div>} />
        </Routes>
      </main>
    </>
  );
}
