import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();


import rateLimit from '@fastify/rate-limit';

import swaggerPlugin from './plugins/swagger';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user.routes';
import { donationRoutes } from './routes/donation.routes';
import { taskRoutes } from './routes/task.routes';
import queueUIRouter from './queues/queueUI';
import { healthcheckRoutes } from './routes/healthcheck.routes';

const app = Fastify();

async function start() {
  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(swaggerPlugin);

  // Add root route for GET /
  app.get('/', async (request, reply) => {
    return { message: 'Solia API is up and running 🚀' };
  });

  // Add route to list all registered routes for debugging
  app.get('/routes', async (request, reply) => {
    return app.printRoutes();
  });

  app.register(authRoutes);
  app.register(userRoutes);
  app.register(donationRoutes);
  app.register(taskRoutes);
  app.register(queueUIRouter);
  app.register(healthcheckRoutes);

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
