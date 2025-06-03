import Fastify from 'fastify';
import { authRoutes } from '../../routes/auth';
import { beforeEach, afterEach, beforeAll, afterAll, describe, it, expect } from 'vitest';
import { resetDatabase } from '../../tests/testSetup';

import { prisma } from '../../lib/prisma';

describe('Auth Routes', () => {
  const fastify = Fastify();

  beforeEach(async () => {
    await resetDatabase();
  });

  beforeAll(async () => {
    await authRoutes(fastify);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /auth/signup should create a new user and return token and user with correct role and tenant', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'User',
        lastName: 'Name',
        roleId: 'OPERATOR',
        tenantId: 'tenant-france',
        organizationName: 'Test Org',
      },
    });

    if (response.statusCode !== 201) {
      console.error('Signup failed:', response.statusCode, response.body);
    }

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user.roleId).toBe('OPERATOR');
    expect(body.user.tenantId).toBe('tenant-france');
  });

  it('POST /auth/signup should reject with 400 if email is already used', async () => {
    // First signup
    await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'Org',
        lastName: 'A',
        roleId: 'OPERATOR',
        tenantId: 'tenant-france',
        organizationName: 'Test Org',
      },
    });

    // Second signup with same email
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'duplicate@example.com',
        password: 'password123',
        firstName: 'Org',
        lastName: 'B',
        roleId: 'OPERATOR',
        tenantId: 'tenant-france',
        organizationName: 'Test Org 2',
      },
    });

    if (response.statusCode !== 400) {
      console.error('Duplicate signup did not fail as expected:', response.statusCode, response.body);
    }

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

    it('POST /auth/login should return 200 and token', async () => {
      // First signup to create user
      await fastify.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'loginuser@example.com',
          password: 'password123',
          firstName: 'Login',
          lastName: 'User',
          roleId: 'Operator',
          tenantId: 'default-tenant',
        },
      });

      // Login
      const response = await fastify.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'loginuser@example.com',
          password: 'password123',
          tenantId: 'default-tenant',
        },
      });

      if (response.statusCode !== 200) {
        console.error('Login failed:', response.statusCode, response.body);
      }

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('user');
    });
});
