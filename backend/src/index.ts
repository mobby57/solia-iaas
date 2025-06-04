import type { IncomingMessage, ServerResponse } from 'http';
import rateLimit from '@fastify/rate-limit';

import dotenv from 'dotenv';
import Fastify, {
  FastifyInstance,
  FastifyTypeProviderDefault,
  RawServerDefault,
  FastifyBaseLogger,
} from 'fastify';
dotenv.config();

import swaggerPlugin from './plugins/swagger';

import queueUIRouter from './queues/queueUI';
import { authRoutes } from './routes/auth';
import { donationRoutes } from './routes/donation.routes';
import { healthcheckRoutes } from './routes/healthcheck.routes';
import { taskRoutes } from './routes/task.routes';
import { userRoutes } from './routes/user.routes';

export function buildApp() {
  const app = Fastify();

  app.register(rateLimit as any, {
    max: 100,
    timeWindow: '1 minute',
  });

  app.register(swaggerPlugin as any);

  // Add root route for GET /
  app.get('/', async (_request, _reply) => {
    return { message: 'Solia API is up and running 🚀' };
  });

  // Add route to list all registered routes for debugging
  app.get('/routes', async (_request, _reply) => {
    return app.printRoutes();
  });

  app.register(authRoutes as any);
  app.register(userRoutes as any);
  app.register(donationRoutes as any);
  app.register(taskRoutes as any);
  app.register(queueUIRouter as any);
  app.register(healthcheckRoutes as any);

  return app;
}

export async function start() {
  const app = buildApp();

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
