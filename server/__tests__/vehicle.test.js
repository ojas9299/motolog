const request = require('supertest');
const app = require('../server');
const Vehicle = require('../models/vehicle');
const FuelLog = require('../models/FuelLog');
const Trip = require('../models/Trip');

describe('Vehicle API', () => {
  afterEach(() => jest.restoreAllMocks());

  it('GET /api/vehicle should return vehicles (happy path)', async () => {
    jest.spyOn(Vehicle, 'find').mockReturnValue({ sort: () => ({ skip: () => ({ limit: () => Promise.resolve([{ _id: 'v1', brand: 'Honda' }]) }) }) });
    jest.spyOn(Vehicle, 'countDocuments').mockResolvedValue(1);
    const res = await request(app).get('/api/vehicle');
    expect(res.statusCode).toBe(200);
    expect(res.body.vehicles).toHaveLength(1);
  });

  it('GET /api/vehicle/:id should return a vehicle (happy path)', async () => {
    jest.spyOn(Vehicle, 'findById').mockResolvedValue({ _id: 'v1', brand: 'Honda' });
    const res = await request(app).get('/api/vehicle/v1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('brand', 'Honda');
  });

  it('GET /api/vehicle/:id should return 404 if not found', async () => {
    jest.spyOn(Vehicle, 'findById').mockResolvedValue(null);
    const res = await request(app).get('/api/vehicle/doesnotexist');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/vehicle should create a vehicle (happy path)', async () => {
    const vehicle = { type: 'car', brand: 'Honda', model: 'Civic', year: 2020, registrationNumber: 'ABC123', kilometersDriven: 10000, userId: 'u1', owner: 'John' };
    jest.spyOn(Vehicle.prototype, 'save').mockResolvedValue({ ...vehicle, _id: 'v1' });
    const res = await request(app).post('/api/vehicle').send(vehicle);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('brand', 'Honda');
  });

  it('POST /api/vehicle should return 400 if missing fields', async () => {
    const res = await request(app).post('/api/vehicle').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing required fields');
  });

  it('PUT /api/vehicle/:id should update a vehicle (happy path)', async () => {
    jest.spyOn(Vehicle, 'findOneAndUpdate').mockResolvedValue({ _id: 'v1', brand: 'Honda', userId: 'u1' });
    const res = await request(app).put('/api/vehicle/v1').send({ brand: 'Honda', userId: 'u1' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('brand', 'Honda');
  });

  it('PUT /api/vehicle/:id should return 400 if missing userId', async () => {
    const res = await request(app).put('/api/vehicle/v1').send({ brand: 'Honda' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Missing required field: userId');
  });

  it('DELETE /api/vehicle/:id should delete vehicle and related data (happy path)', async () => {
    jest.spyOn(FuelLog, 'deleteMany').mockResolvedValue({});
    jest.spyOn(Trip, 'deleteMany').mockResolvedValue({});
    jest.spyOn(Vehicle, 'findOneAndDelete').mockResolvedValue({ _id: 'v1' });
    const res = await request(app).delete('/api/vehicle/v1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /api/vehicle/:id should return 404 if not found', async () => {
    jest.spyOn(FuelLog, 'deleteMany').mockResolvedValue({});
    jest.spyOn(Trip, 'deleteMany').mockResolvedValue({});
    jest.spyOn(Vehicle, 'findOneAndDelete').mockResolvedValue(null);
    const res = await request(app).delete('/api/vehicle/doesnotexist');
    expect(res.statusCode).toBe(404);
  });
}); 