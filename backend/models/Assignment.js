const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskStatus: {
      type: String,
      enum: ["assigned", "in-progress", "completed"],
      default: "assigned",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
