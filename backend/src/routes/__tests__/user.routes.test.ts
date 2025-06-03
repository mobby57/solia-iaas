import Fastify from 'fastify';
import { userRoutes } from '../user.routes';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('User Routes', () => {
  const fastify = Fastify();

  // Mock tenantMiddleware to set tenantId
  const tenantMiddleware = (request: any, reply: any, done: any) => {
    request.tenantId = 'test-tenant';
    done();
  };

  beforeAll(async () => {
    // Register tenantMiddleware before userRoutes
    fastify.addHook('preHandler', tenantMiddleware);

    // Register user routes
    await userRoutes(fastify);

    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('GET /users should return 200 and an array', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/users',
      headers: {
        'x-tenant-id': 'default-tenant' // updated to match seed data tenantId
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
  });
});
