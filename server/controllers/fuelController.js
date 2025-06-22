// controllers/fuelController.js
const FuelLog = require("../models/fuelLog");

// Create new fuel log
exports.createFuelLog = async (req, res) => {
  try {
    const { userId } = req.auth; // may be undefined if no auth
    const { vehicleId, odoReading, fuelLitres } = req.body;

    const newLog = await FuelLog.create({
      userId,
      vehicleId,
      odoReading,
      fuelLitres,
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error("❌ Fuel log error:", err); // ADD THIS
    res
      .status(500)
      .json({
        error: "Failed to create fuel log",
        details: err.message || err,
      });
  }
};

// Get all fuel logs for a vehicle
exports.getFuelLogsByVehicle = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { vehicleId } = req.params;

    const logs = await FuelLog.find({ userId, vehicleId }).sort({
      createdAt: -1,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to get fuel logs", details: err });
  }
};

// Get a single fuel log by ID
exports.getFuelLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await FuelLog.findById(id);
    if (!log) return res.status(404).json({ error: "Fuel log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fuel log", details: err });
  }
};

// Update a fuel log
exports.updateFuelLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { odoReading, fuelLitres } = req.body;

    const updatedLog = await FuelLog.findByIdAndUpdate(
      id,
      { odoReading, fuelLitres },
      { new: true }
    );

    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update fuel log", details: err });
  }
};

// Delete a fuel log
exports.deleteFuelLog = async (req, res) => {
  try {
    const { id } = req.params;
    await FuelLog.findByIdAndDelete(id);
    res.json({ message: "Fuel log deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete fuel log", details: err });
  }
};
