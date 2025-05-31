import Fastify from 'fastify';
import { loginRoutes } from '../login';
import { vi, describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Auth Routes', () => {
  const fastify = Fastify();

  beforeAll(async () => {
    await loginRoutes(fastify);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it('POST /auth/login should return 200 and token', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'admin@example.com',
        password: 'ChangeMe123!'
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
  });
});
