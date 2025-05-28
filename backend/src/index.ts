import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

import rateLimit from '@fastify/rate-limit';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user.routes';
import { donationRoutes } from './routes/donation.routes';
import { taskRoutes } from './routes/task.routes';
import queueUIRouter from './queues/queueUI';

const app = Fastify();

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

app.register(authRoutes);
app.register(userRoutes);
app.register(donationRoutes);
app.register(taskRoutes);
app.register(queueUIRouter);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
