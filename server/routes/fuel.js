// routes/fuel.js
const express = require("express");
const router = express.Router();
const {
  createFuelLog,
  getFuelLogsByVehicle,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
} = require("../controllers/fuelController");
// const { requireAuth } = require("@clerk/express"); // or your own middleware

router.post("/", createFuelLog);
router.get("/:vehicleId", getFuelLogsByVehicle);
router.get("/log/:id", getFuelLogById);
router.put("/log/:id", updateFuelLog);
router.delete("/log/:id", deleteFuelLog);

module.exports = router;
