import Fastify from 'fastify';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '../../lib/prisma';
import { authRoutes } from '../auth';

describe('Auth Routes', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    fastify.register(authRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear users collection or reset test database here if possible
    // For example, if you have a resetTestDatabase function:
    // await resetTestDatabase();
  });

  it('POST /auth/signup should create a new user and return token', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'testuser@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        roleId: 'OPERATOR',
        tenantId: 'tenant-france',
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
        firstName: 'Login',
        lastName: 'User',
        roleId: 'OPERATOR',
        tenantId: 'tenant-france',
      },
    });

    // Then login
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'loginuser@example.com',
        password: 'password123',
        tenantId: 'tenant-france',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user.email).toBe('loginuser@example.com');
  });

  it('POST /auth/signup should reject with 400 for missing fields', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        roleId: '',
        tenantId: '',
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

  it('POST /auth/login should reject with 401 for invalid credentials', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
        tenantId: 'tenant-france',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

  it('POST /auth/login should reject with 401 for missing tenantId', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'loginuser@example.com',
        password: 'password123',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });
});
