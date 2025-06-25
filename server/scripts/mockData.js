// server/scripts/mockData.js
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const FuelLog = require('../models/FuelLog');
const Trip = require('../models/Trip');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/motolog';

const mockUsers = [
  { id: 'user_2yX470zK20YTpVRbZu9bct05a3w', name: 'Ojas Clerk' },
];

const mockVehicles = [
  {
    type: 'bike', brand: 'Honda', model: 'CBR250R', year: 2018, registrationNumber: 'ABC1234', kilometersDriven: 25000, color: 'Red', imageUrl: '',
  },
  {
    type: 'car', brand: 'Toyota', model: 'Corolla', year: 2020, registrationNumber: 'XYZ5678', kilometersDriven: 40000, color: 'Blue', imageUrl: '',
  },
  {
    type: 'bike', brand: 'Yamaha', model: 'FZ-S', year: 2019, registrationNumber: 'YAMFZ123', kilometersDriven: 18000, color: 'Black', imageUrl: '',
  },
  {
    type: 'car', brand: 'Hyundai', model: 'i20', year: 2021, registrationNumber: 'HYUI2011', kilometersDriven: 12000, color: 'White', imageUrl: '',
  },
  {
    type: 'bike', brand: 'Royal Enfield', model: 'Classic 350', year: 2022, registrationNumber: 'RECL3509', kilometersDriven: 8000, color: 'Green', imageUrl: '',
  },
];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Vehicle.deleteMany({});
  await FuelLog.deleteMany({});
  await Trip.deleteMany({});

  for (const user of mockUsers) {
    for (const v of mockVehicles) {
      const vehicle = await Vehicle.create({
        ...v,
        userId: user.id,
        owner: user.name,
        verified: true,
      });
      // Fuel logs
      let odo = v.kilometersDriven - 2000;
      for (let i = 0; i < 20; i++) {
        const fuelLitres = 8 + Math.random() * 4;
        odo += 200 + Math.random() * 100;
        await FuelLog.create({
          userId: user.id,
          vehicleId: vehicle._id,
          odoReading: Math.round(odo),
          fuelLitres: Math.round(fuelLitres * 10) / 10,
          createdAt: randomDate(new Date(2023, 0, 1), new Date()),
        });
      }
      // Trips
      for (let i = 0; i < 10; i++) {
        const start = randomDate(new Date(2023, 0, 1), new Date());
        const end = new Date(start.getTime() + (1 + Math.random()) * 3600 * 1000);
        await Trip.create({
          userId: user.id,
          owner: user.name,
          vehicleId: vehicle._id,
          brand: v.brand,
          model: v.model,
          color: v.color,
          registrationNumber: v.registrationNumber,
          vehicleImage: v.imageUrl,
          startLocation: `City${i+1}`,
          endLocation: `City${i+2}`,
          startTime: start,
          endTime: end,
          calculatedDistance: 100 + Math.round(Math.random() * 200),
          description: `Trip ${i+1} for ${v.brand} ${v.model}`,
          rating: Math.floor(Math.random() * 5) + 1,
        });
      }
    }
  }
  await mongoose.disconnect();
  console.log('✅ Mock data generated!');
}

seed(); 