// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["bike", "car"], required: true }, // distinguish between them

    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { 
      type: Number, 
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1
    },
    registrationNumber: { 
      type: String, 
      required: true,
      trim: true,
      uppercase: true
    },
    kilometersDriven: { 
      type: Number, 
      required: true,
      min: 0
    },

    color: { type: String, trim: true },
    imageUrl: String, // Optional – for image upload
    userId: { type: String, required: true }, // Clerk/Firebase UID, required
    owner: { type: String, required: true }, // Owner's name (Clerk user's name)
    verified: { type: Boolean, default: false }, // Permanently store verification status
  },
  { timestamps: true }
);

// Unique index to ensure registration numbers are globally unique
vehicleSchema.index({ registrationNumber: 1 }, { unique: true });

// Add validation error message for duplicate registration numbers
vehicleSchema.post('save', function(error, doc, next) {
  if (error.code === 11000) {
    next(new Error('Registration number already exists for this user'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
