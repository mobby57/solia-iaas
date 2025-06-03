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
  validToken = app.jwt.sign({ userId: 'test-user' });
});

afterAll(async () => {
  try {
    await app.close();
  } catch (e) {
    console.error('Error during app.close()', e);
  }
});

describe('GET /api/missions', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request.get('/api/missions');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 if invalid token is provided', async () => {
    const response = await request
      .get('/api/missions')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
  });

  it('should return missions if valid token is provided', async () => {
    // Mock prisma.mission.findMany to return test data with all required fields
    const mockMissions = [
      {
        id: '1',
        name: 'Mission 1',
        type: 'field',
        startDate: new Date(),
        endDate: new Date(),
        organizationId: 'org-1',
        tenantId: 'tenant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
        userId: 'user1',
      },
      {
        id: '2',
        name: 'Mission 2',
        type: 'field',
        startDate: new Date(),
        endDate: new Date(),
        organizationId: 'org-2',
        tenantId: 'tenant-2',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
        userId: 'user2',
      },
    ];
    const findManySpy = vi.spyOn(prisma.mission, 'findMany').mockResolvedValue(mockMissions);

    const response = await request
      .get('/api/missions')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.missions).toEqual(mockMissions);

    // Restore original method
    findManySpy.mockRestore();
  });
});
