import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Fastify from 'fastify';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loginRoutes } from '../login';

const prisma = new PrismaClient();

describe('Auth Routes', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    // Create test user if not exists
    const email = 'admin@example.com';
    const password = 'ChangeMe123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'MANAGER',
          tenantId: 'test-tenant-id', // Adjust tenantId as needed
          firstName: 'Admin',
          lastName: 'User',
        },
      });
    }

    await loginRoutes(fastify);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
    await prisma.$disconnect();
  });

  it('POST /auth/login should return 200 and token', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'admin@example.com',
        password: 'ChangeMe123!',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
  });

  it('POST /auth/login should return 401 for invalid password', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'admin@example.com',
        password: 'WrongPassword!',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

  it('POST /auth/login should return 401 for invalid email', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'nonexistent@example.com',
        password: 'ChangeMe123!',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

  it('POST /auth/login should return 400 for missing email', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        password: 'ChangeMe123!',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('POST /auth/login should return 400 for missing password', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'admin@example.com',
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
