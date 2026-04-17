const express = require("express");
const router = express.Router();
const MaintenanceLog = require("../models/MaintenanceLog");
const Vehicle = require("../models/vehicle");

// POST /api/maintenance
// Create a new maintenance record
router.post("/", async (req, res) => {
  try {
    const { userId, vehicleId, serviceType, cost, odoReading, date, description } = req.body;

    // Basic validation
    if (!userId || !vehicleId || !serviceType || cost === undefined || odoReading === undefined) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const newLog = new MaintenanceLog({
      userId,
      vehicleId,
      serviceType,
      cost,
      odoReading,
      date: date || new Date(),
      description,
    });

    await newLog.save();

    // If serviceType = "service", update vehicle.lastServiceOdo
    if (serviceType === "service") {
      await Vehicle.findByIdAndUpdate(vehicleId, { lastServiceOdo: odoReading });
    }

    res.status(201).json({ success: true, log: newLog });
  } catch (error) {
    console.error("Error adding maintenance log:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/maintenance/:vehicleId
// Return all maintenance logs for a vehicle
router.get("/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized: Missing userId" });
    }

    const logs = await MaintenanceLog.find({ vehicleId, userId }).sort({ date: -1 });
    
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching maintenance logs:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
