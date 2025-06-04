import { FastifyInstance } from 'fastify';

export async function healthcheckRoutes(app: FastifyInstance) {
  app.get('/api/health', async (_request, reply) => {
    return reply.status(200).send({ status: 'ok', message: 'API is healthy' });
  });
}
