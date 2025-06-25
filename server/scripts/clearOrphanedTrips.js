const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/motolog';

async function clearOrphanedTrips() {
  await mongoose.connect(MONGO_URI);
  const vehicleIds = new Set((await Vehicle.find({}, '_id')).map(v => v._id.toString()));
  const orphanedTrips = await Trip.find({});
  const toDelete = orphanedTrips.filter(trip => !vehicleIds.has(trip.vehicleId.toString()));
  if (toDelete.length > 0) {
    const ids = toDelete.map(t => t._id);
    await Trip.deleteMany({ _id: { $in: ids } });
    console.log(`Deleted ${ids.length} orphaned trips.`);
  } else {
    console.log('No orphaned trips found.');
  }
  await mongoose.disconnect();
}

clearOrphanedTrips(); 