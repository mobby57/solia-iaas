import Fastify from 'fastify';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signupController, loginController } from '../../controllers/authController';

describe('Auth Routes', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    // Mock routes for signup and login
    fastify.post('/auth/signup', async (request, reply) => {
      const data = request.body as any;
      return signupController(data, reply);
    });

    fastify.post('/auth/login', async (request, reply) => {
      const data = request.body as any;
      return loginController(data, reply);
    });

    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('POST /auth/signup should create a new user and return token', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User',
        roleId: 'test-role',
        tenantId: 'test-tenant',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user.email).toBe('testuser@example.com');
  });

  it('POST /auth/login should authenticate user and return token', async () => {
    // First create user
    await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'loginuser@example.com',
        password: 'password123',
        name: 'Login User',
        roleId: 'test-role',
        tenantId: 'test-tenant',
      },
    });

    // Then login
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'loginuser@example.com',
        password: 'password123',
        tenantId: 'test-tenant',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user.email).toBe('loginuser@example.com');
  });
});
