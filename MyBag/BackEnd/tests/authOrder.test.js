process.env.JWT_SECRET = 'your-secret-key-here';

require('dotenv').config();
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('../routers/auth/auth-routes');
const orderRoutes = require('../routers/Shop/order-routes');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://mybag-ui-mern.onrender.com', 'https://mybag-mern-1.onrender.com'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || 'your-secret-key'));

app.use('/api/auth', authRoutes);
app.use('/api/shop/order', orderRoutes);

describe('Authentication and Order API tests', () => {
  let server;
  let token;

  beforeAll((done) => {
    server = app.listen(4000, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Register a new user', async () => {
    try {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          Email: 'testuser@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    } catch (error) {
      console.error('Register test error:', error);
      throw error;
    }
  }, 20000);

  test('Login user and receive token cookie', async () => {
    try {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          Email: 'testuser@example.com',
          password: 'password123',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers['set-cookie']).toBeDefined();
      const cookies = res.headers['set-cookie'].join(';');
      const tokenCookie = cookies.match(/token=([^;]+)/);
      expect(tokenCookie).toBeTruthy();
      token = tokenCookie[1];
    } catch (error) {
      console.error('Login test error:', error);
      throw error;
    }
  }, 20000);

  test('Access protected order list endpoint with token cookie', async () => {
    const res = await request(app)
      .get('/api/shop/order/list')
      .set('Cookie', [`token=${token}`]);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('Access protected order list endpoint without token cookie', async () => {
    const res = await request(app)
      .get('/api/shop/order/list');
    expect(res.statusCode).toBe(401);
  });
});
