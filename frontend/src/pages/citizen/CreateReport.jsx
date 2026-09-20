import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CreateReport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    photo: null,
    description: "",
    address: "",
    area: "",
    city: "",
    landmark: "",
    lat: "",
    lng: "",
    severity: 2,
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [locBusy, setLocBusy] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);

  // -----------------------------------
  // NORMAL INPUT CHANGE
  // -----------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // -----------------------------------
  // PHOTO UPLOAD
  // -----------------------------------
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be less than 5MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      photo: file,
    }));

    setError("");
  };

  // -----------------------------------
  // USE MY CURRENT LOCATION
  // -----------------------------------
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    setLocBusy(true);
    setError("");
    setLocationSelected(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Immediately fill latitude and longitude
        setForm((prev) => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        }));

        try {
          // Get address, area and city from backend
          const { data } = await api.get(
            `/location/reverse?lat=${latitude}&lng=${longitude}`
          );

          setForm((prev) => ({
            ...prev,

            address: data.address || prev.address,
            area: data.area || prev.area,
            city: data.city || prev.city,

            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),

            // Landmark stays manually editable
            // and optional.
            landmark: prev.landmark,
          }));

          setLocationSelected(true);
        } catch (err) {
          console.error(
            "Reverse geocoding error:",
            err
          );

          // GPS coordinates are still available
          setLocationSelected(true);

          setError(
            "Location selected, but address details could not be found. Please enter them manually."
          );
        } finally {
          setLocBusy(false);
        }
      },

      (error) => {
        console.error("Location error:", error);

        if (error.code === 1) {
          setError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setError(
            "Your current location could not be determined."
          );
        } else if (error.code === 3) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to get your current location."
          );
        }

        setLocBusy(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // -----------------------------------
  // SUBMIT REPORT
  // -----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Description
    if (!form.description.trim()) {
      setError("Please enter the description.");
      return;
    }

    // Address
    if (!form.address.trim()) {
      setError("Please enter the address.");
      return;
    }

    // Area
    if (!form.area.trim()) {
      setError("Please enter the area.");
      return;
    }

    // City
    if (!form.city.trim()) {
      setError("Please enter the city.");
      return;
    }

    // Latitude
    if (!form.lat) {
      setError(
        "Please enter latitude or use your current location."
      );
      return;
    }

    // Longitude
    if (!form.lng) {
      setError(
        "Please enter longitude or use your current location."
      );
      return;
    }

    const latitude = Number(form.lat);
    const longitude = Number(form.lng);

    // Validate latitude
    if (
      Number.isNaN(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      setError(
        "Latitude must be between -90 and 90."
      );
      return;
    }

    // Validate longitude
    if (
      Number.isNaN(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError(
        "Longitude must be between -180 and 180."
      );
      return;
    }

    setBusy(true);

    try {
      const formData = new FormData();

      // -----------------------------------
      // PHOTO
      // -----------------------------------
      if (form.photo) {
        formData.append("photo", form.photo);
      }

      // -----------------------------------
      // DESCRIPTION
      // -----------------------------------
      formData.append(
        "description",
        form.description.trim()
      );

      // -----------------------------------
      // LOCATION
      // -----------------------------------
      formData.append(
        "location",
        JSON.stringify({
          address: form.address.trim(),
          area: form.area.trim(),
          city: form.city.trim(),
          landmark: form.landmark.trim(),
          lat: latitude,
          lng: longitude,
        })
      );

      // -----------------------------------
      // SEVERITY
      // -----------------------------------
      formData.append(
        "severity",
        String(form.severity)
      );

      // -----------------------------------
      // SEND TO BACKEND
      // -----------------------------------
      await api.post("/reports", formData);

      // -----------------------------------
      // SUCCESS
      // -----------------------------------
      navigate("/citizen/my-reports");
    } catch (err) {
      console.error(
        "Submit report error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  // -----------------------------------
  // PAGE
  // -----------------------------------
  return (
    <div className="page">
      <form
        className="card form-card"
        onSubmit={handleSubmit}
      >
        <h2>New Report</h2>

        {/* ERROR */}
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        {/* ==================================================
            1. PHOTO UPLOAD
        ================================================== */}
        <label htmlFor="photo">
          Photo Upload
        </label>

        <input
          id="photo"
          type="file"
          name="photo"
          accept="image/*"
          onChange={handlePhotoChange}
        />

        {form.photo && (
          <div className="photo-selected">
            ✓ Selected: {form.photo.name}
          </div>
        )}

        {/* ==================================================
            2. DESCRIPTION
        ================================================== */}
        <label htmlFor="description">
          Description *
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the overflowing bin or waste problem"
          required
        />

        {/* ==================================================
            3. ADDRESS
        ================================================== */}
        <label htmlFor="address">
          Address *
        </label>

        <input
          id="address"
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter address"
          required
        />

        {/* ==================================================
            4. AREA
        ================================================== */}
        <label htmlFor="area">
          Area *
        </label>

        <input
          id="area"
          type="text"
          name="area"
          value={form.area}
          onChange={handleChange}
          placeholder="Enter area / locality"
          required
        />

        {/* ==================================================
            5. CITY
        ================================================== */}
        <label htmlFor="city">
          City *
        </label>

        <input
          id="city"
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
        />

        {/* ==================================================
            6. LANDMARK - OPTIONAL
        ================================================== */}
        <label htmlFor="landmark">
          Landmark{" "}
          <span className="optional">
            (Optional)
          </span>
        </label>

        <input
          id="landmark"
          type="text"
          name="landmark"
          value={form.landmark}
          onChange={handleChange}
          placeholder="Enter nearby landmark"
        />

        {/* ==================================================
            7. LATITUDE
        ================================================== */}
        <label htmlFor="lat">
          Latitude *
        </label>

        <input
          id="lat"
          type="number"
          name="lat"
          step="any"
          value={form.lat}
          onChange={handleChange}
          placeholder="Enter latitude"
          required
        />

        {/* ==================================================
            7. LONGITUDE
        ================================================== */}
        <label htmlFor="lng">
          Longitude *
        </label>

        <input
          id="lng"
          type="number"
          name="lng"
          step="any"
          value={form.lng}
          onChange={handleChange}
          placeholder="Enter longitude"
          required
        />

        {/* ==================================================
            8. USE MY LOCATION
        ================================================== */}
        <label>
          Use My Location
        </label>

        <button
          type="button"
          className="btn-secondary"
          onClick={useMyLocation}
          disabled={locBusy}
        >
          {locBusy
            ? "Getting location..."
            : "📍 Use My Location"}
        </button>

        {/* LOCATION RESULT */}
        {locationSelected && (
          <div className="location-success">
            ✓ Location selected

            <small>
              Address:{" "}
              {form.address || "Not found"}
              <br />

              Area:{" "}
              {form.area || "Not found"}
              <br />

              City:{" "}
              {form.city || "Not found"}
              <br />

              Latitude: {form.lat}
              <br />

              Longitude: {form.lng}
            </small>
          </div>
        )}

        {/* ==================================================
            SEVERITY
        ================================================== */}
        <label htmlFor="severity">
          Severity
        </label>

        <select
          id="severity"
          name="severity"
          value={form.severity}
          onChange={handleChange}
        >
          <option value={1}>
            Low
          </option>

          <option value={2}>
            Medium
          </option>

          <option value={3}>
            High
          </option>
        </select>

        {/* ==================================================
            SUBMIT
        ================================================== */}
        <button
          type="submit"
          disabled={busy}
        >
          {busy
            ? "Submitting..."
            : "Submit Report"}
        </button>
      </form>
    </div>
  );
}