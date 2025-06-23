const express = require("express");
const router = express.Router();
const {
  createFuelLog,
  getFuelLogsByVehicle,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
} = require("../controllers/fuelController");

// Removed requireAuth()

router.get("/log/:id", getFuelLogById);
router.put("/log/:id", updateFuelLog);
router.delete("/log/:id", deleteFuelLog);

// Main fetch logs by vehicle
router.get("/:vehicleId", getFuelLogsByVehicle);

// Create log
router.post("/", createFuelLog);

module.exports = router;
