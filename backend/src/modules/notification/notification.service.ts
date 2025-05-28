import prisma from '../../lib/prisma';

export async function getNotifications(tenantId: string) {
  return prisma.notification.findMany({ where: { tenantId } });
}

export async function getNotificationById(id: string) {
  return prisma.notification.findUnique({ where: { id } });
}

export async function createNotification(data: any, tenantId: string) {
  return prisma.notification.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateNotification(id: string, data: any) {
  return prisma.notification.update({
    where: { id },
    data,
  });
}

export async function deleteNotification(id: string) {
  return prisma.notification.delete({ where: { id } });
}
