const express = require("express");
const router = express.Router();
const { getStaffTasks } = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/staff/tasks
router.get("/tasks", protect, authorize("staff"), getStaffTasks);

module.exports = router;
