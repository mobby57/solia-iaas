import { FastifyInstance } from 'fastify';
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from './notification.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function notificationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/notifications', getNotifications);
  fastify.get('/notifications/:id', getNotificationById);

  fastify.post('/notifications', { preHandler: verifyRole(['ADMIN']) }, createNotification);
  fastify.put('/notifications/:id', { preHandler: verifyRole(['ADMIN']) }, updateNotification);
  fastify.delete('/notifications/:id', { preHandler: verifyRole(['ADMIN']) }, deleteNotification);
}
