const request = require('supertest');
const app = require('../server');
const FuelLog = require('../models/FuelLog');

jest.mock('../models/FuelLog');

describe('POST /api/fuel/', () => {
  it('should create a new fuel log and return it (happy path)', async () => {
    const mockLog = {
      _id: '507f1f77bcf86cd799439011',
      userId: 'user123',
      vehicleId: '507f1f77bcf86cd799439012',
      odoReading: 12345,
      fuelLitres: 40,
      createdAt: new Date().toISOString(),
    };
    FuelLog.create.mockResolvedValue(mockLog);

    const res = await request(app)
      .post('/api/fuel/')
      .send({
        userId: mockLog.userId,
        vehicleId: mockLog.vehicleId,
        odoReading: mockLog.odoReading,
        fuelLitres: mockLog.fuelLitres,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      userId: mockLog.userId,
      vehicleId: mockLog.vehicleId,
      odoReading: mockLog.odoReading,
      fuelLitres: mockLog.fuelLitres,
    });
    expect(FuelLog.create).toHaveBeenCalledWith({
      userId: mockLog.userId,
      vehicleId: mockLog.vehicleId,
      odoReading: mockLog.odoReading,
      fuelLitres: mockLog.fuelLitres,
    });
  });
}); 