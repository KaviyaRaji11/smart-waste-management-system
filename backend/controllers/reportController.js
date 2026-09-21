const Report = require("../models/Report");
const { calculatePriority } = require("../utils/priority");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "smart-waste-reports",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(buffer);
  });
};
// ==========================================
// CREATE REPORT - CITIZEN
// ==========================================

exports.createReport = async (req, res) => {
  try {
    const { description, location, severity } = req.body;

    // Validate description
    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    // Parse location
    let parsedLocation = {};

    if (location) {
      try {
        parsedLocation =
          typeof location === "string"
            ? JSON.parse(location)
            : location;
      } catch (err) {
        return res.status(400).json({
          message: "Invalid location data",
        });
      }
    }

    // ==========================================
    // PHOTO UPLOAD
    // ==========================================

    let imageUrl = "";

if (req.file) {
  const result = await uploadToCloudinary(req.file.buffer);
  imageUrl = result.secure_url;
}

console.log("=================================");
console.log("Uploaded file:", req.file ? req.file.originalname : "No image");
console.log("Image URL:", imageUrl);
console.log("=================================");

    // ==========================================
    // CREATE REPORT
    // ==========================================

    const report = await Report.create({
      citizen: req.user._id,

      description: description.trim(),

      location: {
        address: parsedLocation.address || "",
        area: parsedLocation.area || "",
        city: parsedLocation.city || "",
        landmark: parsedLocation.landmark || "",

        lat:
          parsedLocation.lat !== undefined
            ? Number(parsedLocation.lat)
            : undefined,

        lng:
          parsedLocation.lng !== undefined
            ? Number(parsedLocation.lng)
            : undefined,
      },

      severity: Number(severity) || 2,

      imageUrl: imageUrl,
    });

    // ==========================================
    // CALCULATE PRIORITY
    // ==========================================

    const { score, level } = calculatePriority(
      report.severity,
      report.createdAt
    );

    report.priorityScore = score;
    report.priorityLevel = level;

    await report.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (err) {
    console.error("Create report error:", err);

    res.status(500).json({
      message: "Failed to create report",
      error: err.message,
    });
  }
};

// ==========================================
// GET REPORTS
// ==========================================

exports.getReports = async (req, res) => {
  try {
    let reports;

    // Citizens only see their own reports
    if (req.user.role === "citizen") {
      reports = await Report.find({
        citizen: req.user._id,
      })
        .populate("citizen", "name email")
        .sort({ createdAt: -1 });
    } else {
      // Admin and staff see all reports
      reports = await Report.find()
        .populate("citizen", "name email")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      reports,
    });
  } catch (err) {
    console.error("Get reports error:", err);

    res.status(500).json({
      message: "Failed to fetch reports",
      error: err.message,
    });
  }
};

// ==========================================
// GET SINGLE REPORT
// ==========================================

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("citizen", "name email");

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Citizen can only view their own report
    if (
      req.user.role === "citizen" &&
      report.citizen._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this report",
      });
    }

    res.status(200).json({
      report,
    });
  } catch (err) {
    console.error("Get report by ID error:", err);

    res.status(500).json({
      message: "Failed to fetch report",
      error: err.message,
    });
  }
};

// ==========================================
// CANCEL REPORT
// CITIZEN ONLY
// ==========================================

exports.cancelReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    // Report doesn't exist
    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Make sure this report belongs to the logged-in citizen
    if (
      report.citizen.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to cancel this report",
      });
    }

    // Only pending reports can be cancelled
    if (report.status !== "pending") {
      return res.status(400).json({
        message:
          "Only pending reports can be cancelled",
      });
    }

    // Cancel report
    report.status = "cancelled";

    await report.save();

    res.status(200).json({
      message: "Report cancelled successfully",
      report,
    });
  } catch (err) {
    console.error("Cancel report error:", err);

    res.status(500).json({
      message: "Failed to cancel report",
      error: err.message,
    });
  }
};

// ==========================================
// UPDATE REPORT STATUS
// ADMIN / STAFF
// ==========================================

exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "verified",
      "assigned",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = status;

    await report.save();

    res.status(200).json({
      message: "Report status updated successfully",
      report,
    });
  } catch (err) {
    console.error(
      "Update report status error:",
      err
    );

    res.status(500).json({
      message: "Failed to update report status",
      error: err.message,
    });
  }
};

// ==========================================
// UPDATE REPORT PRIORITY
// ADMIN ONLY
// ==========================================

exports.updateReportPriority = async (req, res) => {
  try {
    const {
      priorityScore,
      priorityLevel,
    } = req.body;

    const allowedLevels = [
      "Low",
      "Medium",
      "High",
    ];

    if (
      priorityLevel &&
      !allowedLevels.includes(priorityLevel)
    ) {
      return res.status(400).json({
        message: "Invalid priority level",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (priorityScore !== undefined) {
      const score = Number(priorityScore);

      if (
        Number.isNaN(score) ||
        score < 0 ||
        score > 100
      ) {
        return res.status(400).json({
          message:
            "Priority score must be between 0 and 100",
        });
      }

      report.priorityScore = score;
    }

    if (priorityLevel) {
      report.priorityLevel = priorityLevel;
    }

    await report.save();

    res.status(200).json({
      message: "Report priority updated successfully",
      report,
    });
  } catch (err) {
    console.error(
      "Update report priority error:",
      err
    );

    res.status(500).json({
      message: "Failed to update report priority",
      error: err.message,
    });
  }
};