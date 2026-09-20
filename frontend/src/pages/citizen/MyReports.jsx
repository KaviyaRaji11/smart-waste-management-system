import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // ==========================================
  // FETCH MY REPORTS
  // ==========================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports");

      const data = response.data;

      const reportList = Array.isArray(data)
        ? data
        : data.reports || [];

      setReports(reportList);
    } catch (err) {
      console.error("Fetch reports error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // CANCEL REPORT
  // ==========================================

  const handleCancelReport = async (reportId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(reportId);
      setError("");

      await api.patch(
        `/reports/${reportId}/cancel`
      );

      // Update the report immediately on screen
      setReports((previousReports) =>
        previousReports.map((report) =>
          report._id === reportId
            ? {
                ...report,
                status: "cancelled",
              }
            : report
        )
      );
    } catch (err) {
      console.error(
        "Cancel report error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to cancel report."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";

      case "in-progress":
        return "status-progress";

      case "assigned":
        return "status-assigned";

      case "verified":
        return "status-verified";

      case "cancelled":
        return "status-cancelled";

      default:
        return "status-pending";
    }
  };

  // ==========================================
  // PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (level) => {
    switch (level) {
      case "High":
        return "priority-high";

      case "Medium":
        return "priority-medium";

      default:
        return "priority-low";
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString();
  };

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    const cleanPath = imageUrl.startsWith("/")
      ? imageUrl
      : `/${imageUrl}`;

    return `http://localhost:5001${cleanPath}`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <h2>My Reports</h2>

          <p>Loading your reports...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && reports.length === 0) {
    return (
      <div className="page">
        <div className="card">
          <h2>My Reports</h2>

          <div className="alert-error">
            {error}
          </div>

          <button onClick={fetchReports}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page">
      <div className="card">
        <h2>My Reports</h2>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="empty-state">
            <p>
              You have not submitted any reports yet.
            </p>
          </div>
        ) : (
          <div className="reports-list">
            {reports.map((report) => {
              const imageUrl = getImageUrl(
                report.imageUrl
              );

              const canCancel =
                report.status === "pending";

              return (
                <div
                  className="report-card"
                  key={report._id}
                >
                  {/* =========================
                      PHOTO
                  ========================== */}

                  {imageUrl ? (
                    <div className="report-photo-container">
                      <img
                        src={imageUrl}
                        alt="Waste report"
                        className="report-photo"
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            imageUrl
                          );

                          e.currentTarget.style.display =
                            "none";

                          const errorMessage =
                            e.currentTarget.parentElement.querySelector(
                              ".photo-error"
                            );

                          if (errorMessage) {
                            errorMessage.style.display =
                              "flex";
                          }
                        }}
                      />

                      <div
                        className="photo-error"
                        style={{
                          display: "none",
                        }}
                      >
                        <p>
                          Unable to load this photo.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-photo">
                      <p>No photo uploaded</p>
                    </div>
                  )}

                  {/* =========================
                      REPORT INFORMATION
                  ========================== */}

                  <div className="report-content">
                    <h3>
                      {report.description ||
                        "Waste Report"}
                    </h3>

                    {/* STATUS */}

                    <div className="report-row">
                      <strong>Status:</strong>

                      <span
                        className={`status-badge ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status ===
                        "in-progress"
                          ? "In Progress"
                          : report.status
                              ?.charAt(0)
                              .toUpperCase() +
                            report.status?.slice(
                              1
                            )}
                      </span>
                    </div>

                    {/* PRIORITY */}

                    <div className="report-row">
                      <strong>Priority:</strong>

                      <span
                        className={`priority-badge ${getPriorityClass(
                          report.priorityLevel
                        )}`}
                      >
                        {report.priorityLevel ||
                          "Medium"}
                      </span>

                      {report.priorityScore !==
                        undefined && (
                        <span className="priority-score">
                          Score:{" "}
                          {report.priorityScore}
                        </span>
                      )}
                    </div>

                    {/* ADDRESS */}

                    {report.location?.address && (
                      <div className="report-row">
                        <strong>Address:</strong>

                        <span>
                          {report.location.address}
                        </span>
                      </div>
                    )}

                    {/* AREA */}

                    {report.location?.area && (
                      <div className="report-row">
                        <strong>Area:</strong>

                        <span>
                          {report.location.area}
                        </span>
                      </div>
                    )}

                    {/* CITY */}

                    {report.location?.city && (
                      <div className="report-row">
                        <strong>City:</strong>

                        <span>
                          {report.location.city}
                        </span>
                      </div>
                    )}

                    {/* LANDMARK */}

                    {report.location?.landmark && (
                      <div className="report-row">
                        <strong>Landmark:</strong>

                        <span>
                          {report.location.landmark}
                        </span>
                      </div>
                    )}

                    {/* LATITUDE */}

                    {report.location?.lat !==
                      undefined && (
                      <div className="report-row">
                        <strong>Latitude:</strong>

                        <span>
                          {report.location.lat}
                        </span>
                      </div>
                    )}

                    {/* LONGITUDE */}

                    {report.location?.lng !==
                      undefined && (
                      <div className="report-row">
                        <strong>Longitude:</strong>

                        <span>
                          {report.location.lng}
                        </span>
                      </div>
                    )}

                    {/* SEVERITY */}

                    {report.severity !==
                      undefined && (
                      <div className="report-row">
                        <strong>Severity:</strong>

                        <span>
                          {report.severity === 1
                            ? "Low"
                            : report.severity === 3
                            ? "High"
                            : "Medium"}
                        </span>
                      </div>
                    )}

                    {/* REPORTED */}

                    <div className="report-row">
                      <strong>Reported:</strong>

                      <span>
                        {formatDate(
                          report.createdAt
                        )}
                      </span>
                    </div>

                    {/* =========================
                        CANCEL BUTTON
                    ========================== */}

                    {canCancel && (
                      <div className="cancel-report-container">
                        <button
                          type="button"
                          className="cancel-report-button"
                          onClick={() =>
                            handleCancelReport(
                              report._id
                            )
                          }
                          disabled={
                            cancellingId ===
                            report._id
                          }
                        >
                          {cancellingId ===
                          report._id
                            ? "Cancelling..."
                            : "Cancel Report"}
                        </button>
                      </div>
                    )}

                    {report.status ===
                      "cancelled" && (
                      <div className="cancelled-message">
                        This report has been cancelled.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}