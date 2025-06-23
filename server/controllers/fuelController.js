// controllers/fuelController.js
const FuelLog = require("../models/FuelLog");

// Create new fuel log
exports.createFuelLog = async (req, res) => {
  try {
    // Take userId from req.body instead of req.auth
    const { userId, vehicleId, odoReading, fuelLitres } = req.body;

    const newLog = await FuelLog.create({
      userId,
      vehicleId,
      odoReading,
      fuelLitres,
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error("❌ Fuel log error:", err);
    res.status(500).json({
      error: "Failed to create fuel log",
      details: err.message || err,
    });
  }
};

// Get all fuel logs for a vehicle
exports.getFuelLogsByVehicle = async (req, res) => {
  console.log(
    "👉 getFuelLogsByVehicle hit with vehicleId:",
    req.params.vehicleId
  );
  try {
    // Take userId from query or body instead of req.auth
    const userId = req.query.userId || req.body.userId;
    const { vehicleId } = req.params;

    let logs = await FuelLog.find({ userId, vehicleId }).sort({
      createdAt: 1, // sort oldest to newest for mileage calc
    });

    // Calculate mileage for each log (except the first)
    logs = logs.map((log, idx, arr) => {
      let mileage = null;
      if (idx > 0) {
        const prev = arr[idx - 1];
        const distance = log.odoReading - prev.odoReading;
        if (log.fuelLitres > 0 && distance > 0) {
          mileage = distance / log.fuelLitres;
        }
      }
      // Convert to object and add mileage
      return { ...log.toObject(), mileage };
    });

    // Return newest first (reverse)
    res.json(logs.reverse());
  } catch (err) {
    res.status(500).json({ error: "Failed to get fuel logs", details: err });
  }
};

// Get a single fuel log by ID
exports.getFuelLogById = async (req, res) => {
  console.log("📥 getFuelLogById hit with ID:", req.params.id);

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
