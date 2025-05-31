import { FastifyInstance } from 'fastify';
import { getDashboardData } from './analytics.controller';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get('/dashboard', getDashboardData);
}
