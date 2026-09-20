const axios = require("axios");

// GET /api/location/reverse?lat=13.082680&lng=80.270721
exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        message: "Invalid latitude",
      });
    }

    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        message: "Invalid longitude",
      });
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: "jsonv2",
          addressdetails: 1,
          zoom: 18,
          "accept-language": "en",
        },

        headers: {
          "User-Agent":
            "Smart-Waste-Management-System/1.0",
        },

        timeout: 10000,
      }
    );

    const data = response.data;
    const address = data.address || {};

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.quarter ||
      address.residential ||
      address.city_district ||
      "";

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      "";

    res.json({
      address: data.display_name || "",
      area,
      city,
      latitude,
      longitude,
    });
  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Unable to find address from your location",
    });
  }
};