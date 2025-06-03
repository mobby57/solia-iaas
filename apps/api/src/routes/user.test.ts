import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import supertest from 'supertest';
import { buildApp } from '../app';
import prisma from '../prismaClient';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let request: ReturnType<typeof supertest>;
let validToken: string;

const invalidToken = 'invalid.token.here';

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
  request = supertest(app.server);
  validToken = app.jwt.sign({ userId: 'test-user', tenantId: 'tenant-1', role: 'manager' });
});

afterAll(async () => {
  try {
    await app.close();
  } catch (e) {
    console.error('Error during app.close()', e);
  }
});

describe('GET /api/users', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request.get('/api/users');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if invalid token is provided', async () => {
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
  });

  it('should return users if valid token is provided', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@example.com' },
      { id: '2', name: 'User 2', email: 'user2@example.com' },
    ];
    const findManySpy = vi.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);

    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.users).toEqual(mockUsers);

    findManySpy.mockRestore();
  });
});
