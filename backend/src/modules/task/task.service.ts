import prisma from '../../lib/prisma';

export async function getTasks(tenantId: string) {
  return prisma.task.findMany({ where: { tenantId } });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function createTask(data: any, tenantId: string) {
  return prisma.task.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateTask(id: string, data: any) {
  return prisma.task.update({
    where: { id },
    data,
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({ where: { id } });
}
