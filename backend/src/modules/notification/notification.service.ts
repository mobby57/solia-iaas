import prisma from '../../lib/prisma';
import { NotificationType, NotificationPriority } from '@prisma/client';

export async function createNotification(data: any, tenantId: string) {
  return prisma.notification.create({
    data: {
      ...data,
      tenantId,
      type: data.type as NotificationType,
      priority: data.priority as NotificationPriority,
    },
  });
}

export async function getNotifications(tenantId: string) {
  return prisma.notification.findMany({ where: { tenantId } });
}

export async function getNotificationById(id: string) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function updateNotification(id: string, data: any) {
  try {
    return await prisma.notification.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No notification found for update with the given id');
    }
    throw error;
  }
}

export async function deleteNotification(id: string) {
  return prisma.notification.delete({ where: { id } });
}