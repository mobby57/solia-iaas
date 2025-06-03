import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import { app as app_1 } from '../apps';
import { resetDatabase, disconnectDatabase } from '../tests/testSetup';
import { prisma } from '../lib/prisma';

import fastify from 'fastify';

export const app = fastify({
  logger: false
});
describe('Auth Service', () => {
  beforeAll(async () => {
    await resetDatabase();

    // Création d’un rôle et d’un tenant nécessaires au test
    await prisma.role.create({ data: { id: 'admin', name: 'Admin' } });
    await prisma.tenant.create({ data: { id: 'tenant123', name: 'Tenant Test' } });
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  test('POST /auth/signup - should create a new user and return token', async () => {
    const payload = {
      email: 'testuser@example.com',
      password: 'StrongPass123!',
      firstName: 'Test',
      lastName: 'User',
      roleId: 'admin',
      tenantId: 'tenant123',
      organizationName: 'Test Org'
    };

    const response = await app_1.inject({
      method: 'POST',
      url: '/auth/signup',
      payload,
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe(payload.email);
    expect(body.user.tenantId).toBe(payload.tenantId);
  });

  test('POST /auth/login - should log in an existing user and return token', async () => {
    const loginPayload = {
      email: 'testuser@example.com',
      password: 'StrongPass123!',
      tenantId: 'tenant123',
    };

    const response = await app_1.inject({
      method: 'POST',
      url: '/auth/login',
      payload: loginPayload,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty('token');
    expect(body.user.email).toBe(loginPayload.email);
  });
});
