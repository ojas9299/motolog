// routes/vehicle.js
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const axios = require("axios");
const FuelLog = require("../models/FuelLog");
const Trip = require("../models/Trip");


// Get all vehicles (public)
router.get("/", async (req, res) => {
  console.log("[DEBUG] GET /api/vehicle called", req.query);
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by userId if provided
    const filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    // Fetch vehicles (filtered)
    const vehicles = await Vehicle.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Vehicle.countDocuments(filter);

    res.json({
      vehicles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVehicles: total
    });
  } catch (err) {
    console.error("[DEBUG] Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

// Get a single vehicle by ID
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
});

// Add a new vehicle (requires userId)
router.post("/", async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
    };

    // Validate required fields
    const requiredFields = ['type', 'brand', 'model', 'year', 'registrationNumber', 'kilometersDriven', 'userId'];
    const missingFields = requiredFields.filter(field => !vehicleData[field] && vehicleData[field] !== 0);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        fields: missingFields 
      });
    }

    const newVehicle = new Vehicle(vehicleData);
    const saved = await newVehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating vehicle:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Registration number already exists" });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ error: "Failed to create vehicle" });
  }
});

// Update an existing vehicle (requires userId)
router.put("/:id", async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
    };

    if (!vehicleData.userId) {
      return res.status(400).json({ error: "Missing required field: userId" });
    }

    const updated = await Vehicle.findOneAndUpdate(
      { _id: req.params.id },
      vehicleData,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating vehicle:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(400).json({ error: "Failed to update vehicle" });
  }
});

// Delete a vehicle (public)
router.delete("/:id", async (req, res) => {
  try {
    // Delete all related fuel logs and trips first
    await FuelLog.deleteMany({ vehicleId: req.params.id });
    await Trip.deleteMany({ vehicleId: req.params.id });

    const deleted = await Vehicle.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle and all related data deleted successfully" });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});

module.exports = router;
