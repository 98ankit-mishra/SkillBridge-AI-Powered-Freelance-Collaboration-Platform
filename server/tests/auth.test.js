const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('../routes/auth');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/skillbridge_test_db');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new student successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student'
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    
    const user = await User.findOne({ email: 'student@example.com' });
    expect(user).not.toBeNull();
    expect(user.role).toBe('student');
  });

  it('should fail registration with duplicate email', async () => {
    await User.create({
      name: 'Existing',
      email: 'student@example.com',
      passwordHash: 'hashed',
      role: 'student'
    });
    
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another',
        email: 'student@example.com',
        password: 'password123',
        role: 'client'
      });
      
    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBe(false);
  });
});
