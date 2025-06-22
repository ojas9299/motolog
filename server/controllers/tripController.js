const Trip = require('../models/Trip');
const { calculateTripDistance } = require('../utils/geocoding');
const { validateTripData } = require('../utils/validation');

/**
 * Get all trips for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTrips = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing userId parameter" 
      });
    }

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      data: { trips },
      count: trips.length 
    });
  } catch (error) {
    console.error("❌ Error fetching trips:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch trips" 
    });
  }
};

/**
 * Get a single trip by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    
    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        error: "Trip not found" 
      });
    }
    
    res.json({ 
      success: true, 
      data: trip 
    });
  } catch (error) {
    console.error("❌ Error fetching trip:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid trip ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch trip" 
    });
  }
};

/**
 * Create a new trip
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTrip = async (req, res) => {
  try {
    const tripData = { ...req.body };
    
    // Validate trip data
    const validation = validateTripData(tripData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: "Validation failed", 
        details: validation.errors 
      });
    }
    
    // Calculate distance automatically
    const calculatedDistance = await calculateTripDistance(
      tripData.startLocation, 
      tripData.endLocation
    );
    
    // Create trip with validated data and calculated distance
    const newTrip = new Trip({
      ...validation.validatedData,
      calculatedDistance
    });
    
    const savedTrip = await newTrip.save();
    
    console.log("✅ Trip created successfully:", savedTrip._id);
    
    res.status(201).json({ 
      success: true, 
      data: savedTrip,
      message: "Trip created successfully" 
    });
  } catch (error) {
    console.error("❌ Error creating trip:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        error: "Validation failed", 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to create trip" 
    });
  }
};

/**
 * Update a trip
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const tripData = { ...req.body };
    
    // Validate trip data
    const validation = validateTripData(tripData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: "Validation failed", 
        details: validation.errors 
      });
    }
    
    // Recalculate distance if locations changed
    if (tripData.startLocation || tripData.endLocation) {
      const currentTrip = await Trip.findById(id);
      if (!currentTrip) {
        return res.status(404).json({ 
          success: false, 
          error: "Trip not found" 
        });
      }
      
      const startLocation = tripData.startLocation || currentTrip.startLocation;
      const endLocation = tripData.endLocation || currentTrip.endLocation;
      
      const calculatedDistance = await calculateTripDistance(startLocation, endLocation);
      tripData.calculatedDistance = calculatedDistance;
    }
    
    const updatedTrip = await Trip.findByIdAndUpdate(
      id, 
      { ...validation.validatedData, ...tripData }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedTrip) {
      return res.status(404).json({ 
        success: false, 
        error: "Trip not found" 
      });
    }
    
    console.log("✅ Trip updated successfully:", updatedTrip._id);
    
    res.json({ 
      success: true, 
      data: updatedTrip,
      message: "Trip updated successfully" 
    });
  } catch (error) {
    console.error("❌ Error updating trip:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        error: "Validation failed", 
        details: validationErrors 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: "Failed to update trip" 
    });
  }
};

/**
 * Delete a trip
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrip = await Trip.findByIdAndDelete(id);
    
    if (!deletedTrip) {
      return res.status(404).json({ 
        success: false, 
        error: "Trip not found" 
      });
    }
    
    console.log("✅ Trip deleted successfully:", id);
    
    res.json({ 
      success: true, 
      message: "Trip deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Error deleting trip:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete trip" 
    });
  }
};

/**
 * Test geocoding and distance calculation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const testGeocoding = async (req, res) => {
  try {
    const { startLocation, endLocation } = req.query;
    
    if (!startLocation || !endLocation) {
      return res.status(400).json({ 
        success: false,
        error: "Missing required parameters", 
        required: ["startLocation", "endLocation"] 
      });
    }

    console.log(`🔍 Testing geocoding: ${startLocation} → ${endLocation}`);

    const distance = await calculateTripDistance(startLocation, endLocation);
    
    if (distance === null) {
      return res.status(400).json({ 
        success: false,
        error: "Could not calculate distance for the provided locations"
      });
    }

    res.json({
      success: true,
      data: {
        startLocation,
        endLocation,
        calculatedDistance: distance,
        unit: "kilometers"
      }
    });

  } catch (error) {
    console.error("❌ Error testing geocoding:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to test geocoding" 
    });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  testGeocoding
}; 