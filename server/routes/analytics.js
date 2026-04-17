const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const MaintenanceLog = require('../models/MaintenanceLog');

// @route   GET /api/analytics/cost-intelligence/:vehicleId
// @desc    Get cost breakdown and intelligence for a vehicle
// @access  Public (matching existing patterns)
router.get('/cost-intelligence/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // 1. Fetch all trips for the vehicle
    const trips = await Trip.find({ vehicleId });
    
    let totalDistance = 0;
    trips.forEach(trip => {
      if (trip.calculatedDistance) {
        totalDistance += trip.calculatedDistance;
      }
    });

    // Compute estimated fuel cost based on trips since Trip model doesn't store direct fuel cost
    // Assumes avg 35 kmpl and ₹100/litre for calculation if no direct cost exists
    const AVG_KMPL = 35;
    const FUEL_PRICE = 100;
    const estimatedFuelCost = totalDistance > 0 ? (totalDistance / AVG_KMPL) * FUEL_PRICE : 0;
    
    // We will use estimated fuel cost unless trips miraculously hold 'fuelCost' not in schema
    let totalFuelCost = 0;
    trips.forEach(trip => {
      totalFuelCost += (trip.fuelCost || 0); // Gracefully handle if field gets added later
    });

    if (totalFuelCost === 0 && estimatedFuelCost > 0) {
      totalFuelCost = estimatedFuelCost;
    }

    // 2. Fetch all maintenance logs for the vehicle
    const maintenanceLogs = await MaintenanceLog.find({ vehicleId });
    let totalMaintenanceCost = 0;
    
    maintenanceLogs.forEach(log => {
      if (log.cost) {
        totalMaintenanceCost += log.cost;
      }
    });

    // 3. Compute final costs
    const totalCost = totalFuelCost + totalMaintenanceCost;
    const costPerKm = totalDistance > 0 ? (totalCost / totalDistance) : 0;

    res.json({
      totalDistance,
      totalFuelCost,
      totalMaintenanceCost,
      totalCost,
      costPerKm
    });

  } catch (error) {
    console.error('Error fetching cost intelligence:', error);
    res.status(500).json({ error: 'Server error calculating cost intelligence' });
  }
});

module.exports = router;
