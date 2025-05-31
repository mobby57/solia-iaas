import prisma from '../lib/prisma';

export async function getNotifications(tenantId: string) {
  return prisma.notification.findMany({ where: { tenantId } });
}

export async function getNotificationById(id: string) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function createNotification(data: any) {
  if (!data.body) {
    throw new Error('Notification creation requires a body field');
  }
  // Map recipientId to userId if present
  if (data.recipientId) {
    data.userId = data.recipientId;
    delete data.recipientId;
  }
  return prisma.notification.create({
    data,
  });
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
  try {
    return await prisma.notification.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No notification found for delete with the given id');
    }
    throw error;
  }
}
