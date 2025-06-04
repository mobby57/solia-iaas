import { FastifyReply, FastifyRequest } from 'fastify';
import * as notificationService from './notification.service';

export async function getNotifications(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const notifications = await notificationService.getNotifications(tenantId);
    reply.send(notifications);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch notifications' });
  }
}

export async function getNotificationById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const notification = await notificationService.getNotificationById(id);
    if (!notification) {
      reply.status(404).send({ error: 'Notification not found' });
      return;
    }
    reply.send(notification);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch notification' });
  }
}

export async function createNotification(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const notificationData = request.body as any;
  try {
    const notification = await notificationService.createNotification(notificationData, tenantId);
    reply.status(201).send(notification);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to create notification' });
  }
}

export async function updateNotification(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const notificationData = request.body as any;
  try {
    const notification = await notificationService.updateNotification(id, notificationData);
    if (!notification) {
      reply.status(404).send({ error: 'Notification not found' });
      return;
    }
    reply.send(notification);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to update notification' });
  }
}

export async function deleteNotification(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await notificationService.deleteNotification(id);
    reply.status(204).send();
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to delete notification' });
  }
}
