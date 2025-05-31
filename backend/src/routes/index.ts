import { FastifyInstance } from 'fastify';
import { userRoutes } from './user.routes';
import { authRoutes } from './auth';
import { organizationRoutes } from './organization.routes';
import { donationRoutes } from './donation.routes';
import { missionRoutes } from './mission.routes';
import { taskRoutes } from './task.routes';
import { documentRoutes } from './document.routes';
import { kycRoutes } from '../modules/kyc/kyc.routes';
import { analyticsRoutes } from '../modules/analytics/analytics.routes';

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