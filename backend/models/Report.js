const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      address: {
        type: String,
        trim: true,
        default: "",
      },

      area: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      landmark: {
        type: String,
        trim: true,
        default: "",
      },

      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },

    severity: {
      type: Number,
      enum: [1, 2, 3],
      default: 2,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "verified",
        "assigned",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    priorityScore: {
      type: Number,
      default: 0,
    },

    priorityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);