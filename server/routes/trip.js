const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

// Trip routes
router.get("/", tripController.getTrips);
router.get("/:id", tripController.getTripById);
router.post("/", tripController.createTrip);
router.put("/:id", tripController.updateTrip);
router.delete("/:id", tripController.deleteTrip);

// Test geocoding route
router.get("/test/geocode", tripController.testGeocoding);

module.exports = router; 