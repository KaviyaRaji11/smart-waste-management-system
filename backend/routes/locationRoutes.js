const express = require("express");

const router = express.Router();

const { reverseGeocode } = require("../controllers/locationController");

const { protect } = require("../middleware/auth");

router.get("/reverse", protect, reverseGeocode);

module.exports = router;