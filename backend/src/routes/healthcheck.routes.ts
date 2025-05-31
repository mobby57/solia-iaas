import { FastifyInstance } from 'fastify';

export async function healthcheckRoutes(fastify: FastifyInstance) {
  fastify.get('/healthcheck', async (request, reply) => {
    return { status: 'ok' };
  });
}
