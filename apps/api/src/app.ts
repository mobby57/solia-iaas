import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { missionRoutes } from './routes/mission';
import { userRoutes } from './routes/user';
import { organizationRoutes } from './routes/organization';
import { donationRoutes } from './routes/donation';
import { taskRoutes } from './routes/task';
import { documentRoutes } from './routes/document';
import { commentRoutes } from './routes/comment';
import { tagRoutes } from './routes/tag';

export async function buildApp() {
  const app = Fastify();

  app.addHook('onRequest', async (request, reply) => {
    app.log.info('Incoming request: ' + request.method + ' ' + request.url);
  });

  await app.register(jwt, { secret: 'test-secret' });

  app.decorate('authenticate', async (request, reply) => {
    if (!request.headers.authorization) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }
    try {
      await request.jwtVerify();
    } catch (err) {
      app.log.error('JWT verification failed:', err);
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  await app.register(missionRoutes, { prefix: '/api' });
  await app.register(userRoutes, { prefix: '/api' });
  await app.register(organizationRoutes, { prefix: '/api' });
  await app.register(donationRoutes, { prefix: '/api' });
  await app.register(taskRoutes, { prefix: '/api' });
  await app.register(documentRoutes, { prefix: '/api' });
  await app.register(commentRoutes, { prefix: '/api' });
  await app.register(tagRoutes, { prefix: '/api' });

  // Health check route
  app.get('/health', async (request, reply) => {
    return { status: 'ok' };
  });

  await app.ready();

  return app;
}
