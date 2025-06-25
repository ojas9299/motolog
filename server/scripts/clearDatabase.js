const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const FuelLog = require('../models/FuelLog');
const Trip = require('../models/Trip');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/motolog';

async function clear() {
  await mongoose.connect(MONGO_URI);
  await Vehicle.deleteMany({});
  await FuelLog.deleteMany({});
  await Trip.deleteMany({});
  await mongoose.disconnect();
  console.log('✅ Database cleared!');
}

clear(); 