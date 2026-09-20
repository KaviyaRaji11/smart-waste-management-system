const express = require("express");
const router = express.Router();
const { optimizeRoute } = require("../controllers/routeController");
const { protect, authorize } = require("../middleware/auth");

router.post("/optimize", protect, authorize("admin"), optimizeRoute);

module.exports = router;
