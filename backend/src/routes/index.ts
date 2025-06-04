import { FastifyInstance } from 'fastify';
import { analyticsRoutes } from '../modules/analytics/analytics.routes';
import { kycRoutes } from '../modules/kyc/kyc.routes';
import { authRoutes } from './auth';
import { documentRoutes } from './document.routes';
import { donationRoutes } from './donation.routes';
import { missionRoutes } from './mission.routes';
import { organizationRoutes } from './organization.routes';
import { taskRoutes } from './task.routes';
import { userRoutes } from './user.routes';

export async function routes(fastify: FastifyInstance) {
  await authRoutes(fastify);
  await userRoutes(fastify);
  await organizationRoutes(fastify);
  await donationRoutes(fastify);
  await missionRoutes(fastify);
  await taskRoutes(fastify);
  await documentRoutes(fastify);
  await kycRoutes(fastify);
  await analyticsRoutes(fastify);
}
