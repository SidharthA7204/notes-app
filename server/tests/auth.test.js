import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/User.js';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Authentication API Endpoints', () => {
  const testUser = {
    name: 'Alice Developer',
    email: 'alice@example.com',
    password: 'password123',
  };

  it('POST /api/auth/register should register a new user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.name).toBe(testUser.name);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.password).toBeUndefined(); // Password must never be returned
  });

  it('POST /register (root alias) should also register a user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'Bob Builder',
        email: 'bob@example.com',
        password: 'securepassword',
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/register should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('POST /api/auth/register should validate invalid email format and short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'not-an-email',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveLength(3);
  });

  it('POST /api/auth/login should authenticate registered user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('POST /login (root alias) should authenticate registered user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it('GET /api/auth/me should return current user profile with valid JWT', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginRes.body.token;

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(testUser.email);
  });

  it('GET /api/auth/me should reject request without JWT token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
