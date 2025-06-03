import { prisma } from '../lib/prisma';
import { ObjectId } from 'mongodb';
import { Task } from '@prisma/client';

function validateObjectId(id: string): string {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id).toHexString();
}

export async function getTasks(tenantId: string) {
  return prisma.task.findMany();
}

export async function getTaskById(id: string, tenantId: string) {
  const validId = validateObjectId(id);
  return prisma.task.findFirst({ where: { id: validId } });
}

export async function createTask(data: any, tenantId: string) {
  const validUserId = data.userId ? validateObjectId(data.userId) : undefined;

  return prisma.task.create({
    data: {
      ...data,
      ...(validUserId && { userId: validUserId }),
    },
  });
}

export async function updateTask(
  id: string,
  data: Partial<Task>,
  tenantId: string
) {
  const validId = validateObjectId(id);
  const validUserId = data.userId ? validateObjectId(data.userId) : undefined;

  const updated = await prisma.task.updateMany({
    where: { id: validId },
    data: { ...data, ...(validUserId && { userId: validUserId }) },
  });

  if (updated.count === 0) {
    throw new Error('No task found for update with the given id');
  }

  // Return the updated task
  return prisma.task.findFirst({ where: { id: validId } });
}

export async function deleteTask(id: string, tenantId: string) {
  const validId = validateObjectId(id);

  const deleted = await prisma.task.deleteMany({
    where: { id: validId },
  });

  if (deleted.count === 0) {
    throw new Error('No task found for delete with the given id');
  }

  return deleted;
}
