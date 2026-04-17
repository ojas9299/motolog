const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["oil", "tire", "service", "repair", "other"],
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  odoReading: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("MaintenanceLog", maintenanceLogSchema);
