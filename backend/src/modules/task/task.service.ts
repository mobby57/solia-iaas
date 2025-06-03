import {prisma} from '../../lib/prisma';

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

export async function updateTask(id: string, data: any, tenantId: string) {
  try {
    const updated = await prisma.task.updateMany({
      where: { id, tenantId },
      data,
    });

    if (updated.count === 0) {
      throw new Error('No task found for update with the given id and tenantId');
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    return task;
  } catch (error: any) {
    if (error.message === 'No task found for update with the given id and tenantId' || error.code === 'P2025') {
      throw new Error('No task found for update with the given id and tenantId');
    }
    throw error;
  }
}

export async function deleteTask(id: string, tenantId: string) {
  // Check if task exists before deleting
  const task = await prisma.task.findFirst({ where: { id, tenantId } });
  if (!task) {
    throw new Error('No task found for delete with the given id and tenantId');
  }
  return prisma.task.delete({ where: { id } });
}
