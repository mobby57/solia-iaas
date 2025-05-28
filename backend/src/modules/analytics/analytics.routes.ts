import { FastifyInstance } from 'fastify';
import {
  getAnalytics,
  getAnalyticsById,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
} from './analytics.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/analytics', getAnalytics);
  fastify.get('/analytics/:id', getAnalyticsById);

  fastify.post('/analytics', { preHandler: verifyRole(['ADMIN']) }, createAnalytics);
  fastify.put('/analytics/:id', { preHandler: verifyRole(['ADMIN']) }, updateAnalytics);
  fastify.delete('/analytics/:id', { preHandler: verifyRole(['ADMIN']) }, deleteAnalytics);
}
