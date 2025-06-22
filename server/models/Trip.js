const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  owner: { type: String, required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String },
  registrationNumber: { type: String },
  vehicleImage: { type: String }, // URL
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  calculatedDistance: { type: Number }, // Will be calculated automatically
  tripImages: [{ type: String }], // Array of URLs
  description: { type: String }, // Changed from notes
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema); 