const Report = require("../models/Report");
const { nearestNeighborRoute } = require("../utils/nearestNeighbor");

// POST /api/routes/optimize (admin) — FR-09 / Section 10 of the requirement doc.
// Body: { reportIds: [...], depot?: { lat, lng } }
// Uses a nearest-neighbor heuristic on stored lat/lng. Locations missing coordinates
// are skipped and reported back, since this is not a real map/geocoding service.
exports.optimizeRoute = async (req, res) => {
  try {
    const { reportIds, depot } = req.body;
    if (!Array.isArray(reportIds) || reportIds.length === 0) {
      return res.status(400).json({ message: "reportIds must be a non-empty array" });
    }

    const reports = await Report.find({ _id: { $in: reportIds } });

    const withCoords = [];
    const skipped = [];
    reports.forEach((r) => {
      if (typeof r.location?.lat === "number" && typeof r.location?.lng === "number") {
        withCoords.push({
          id: r._id,
          name: r.location.address || r.description.slice(0, 40),
          lat: r.location.lat,
          lng: r.location.lng,
        });
      } else {
        skipped.push(r._id);
      }
    });

    const { order, totalDistanceKm } = nearestNeighborRoute(withCoords, depot);

    res.json({
      depot: depot || (withCoords[0] ? { lat: withCoords[0].lat, lng: withCoords[0].lng } : null),
      order,
      totalDistanceKm,
      skippedNoCoordinates: skipped,
      note: "Generated using a nearest-neighbor heuristic on stored coordinates. Not connected to a live map/routing service.",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate route", error: err.message });
  }
};
