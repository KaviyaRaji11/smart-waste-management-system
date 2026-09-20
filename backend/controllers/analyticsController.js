const Report = require("../models/Report");
const Assignment = require("../models/Assignment");

// GET /api/analytics  (admin) — FR-10 / Section 11 of the requirement doc
exports.getAnalytics = async (req, res) => {
  try {
    const [total, pending, verified, assigned, inProgress, completed] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "verified" }),
      Report.countDocuments({ status: "assigned" }),
      Report.countDocuments({ status: "in-progress" }),
      Report.countDocuments({ status: "completed" }),
    ]);

    const priorityAgg = await Report.aggregate([
      { $group: { _id: "$priorityLevel", count: { $sum: 1 } } },
    ]);
    const priorityDistribution = { Low: 0, Medium: 0, High: 0 };
    priorityAgg.forEach((p) => {
      if (p._id) priorityDistribution[p._id] = p.count;
    });

    const areaAgg = await Report.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$location.address", "Unspecified"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const areaWiseReports = areaAgg.map((a) => ({ area: a._id || "Unspecified", count: a.count }));

    const staffCompletedAgg = await Assignment.aggregate([
      { $match: { taskStatus: "completed" } },
      { $group: { _id: "$staff", completedCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "staffInfo",
        },
      },
      { $unwind: "$staffInfo" },
      { $project: { name: "$staffInfo.name", completedCount: 1, _id: 0 } },
    ]);

    res.json({
      totals: { total, pending, verified, assigned, inProgress, completed },
      priorityDistribution,
      areaWiseReports,
      collectionActivity: staffCompletedAgg,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to compute analytics", error: err.message });
  }
};
