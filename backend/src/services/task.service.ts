import prisma from '../lib/prisma';
import { ObjectId } from 'mongodb';
import { Task } from '@prisma/client';

function validateObjectId(id: string): string {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id).toHexString();
}

export async function getTasks(tenantId: string) {
  const validTenantId = validateObjectId(tenantId);
  return prisma.task.findMany({ where: { tenantId: validTenantId } });
}

export async function getTaskById(id: string, tenantId: string) {
  const validId = validateObjectId(id);
  const validTenantId = validateObjectId(tenantId);
  return prisma.task.findFirst({ where: { id: validId, tenantId: validTenantId } });
}

export async function createTask(data: any, tenantId: string) {
  const validTenantId = validateObjectId(tenantId);
  const validUserId = data.userId ? validateObjectId(data.userId) : undefined;

  return prisma.task.create({
    data: {
      ...data,
      tenantId: validTenantId,
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
  const validTenantId = validateObjectId(tenantId);
  const validUserId = data.userId ? validateObjectId(data.userId) : undefined;

  const updated = await prisma.task.updateMany({
    where: { id: validId, tenantId: validTenantId },
    data: { ...data, ...(validUserId && { userId: validUserId }) },
  });

  if (updated.count === 0) {
    throw new Error('No task found for update with the given id and tenantId');
  }

  // Return the updated task
  return prisma.task.findFirst({ where: { id: validId, tenantId: validTenantId } });
}

export async function deleteTask(id: string, tenantId: string) {
  const validId = validateObjectId(id);
  const validTenantId = validateObjectId(tenantId);

  const deleted = await prisma.task.deleteMany({
    where: { id: validId, tenantId: validTenantId },
  });

  if (deleted.count === 0) {
    throw new Error('No task found for delete with the given id and tenantId');
  }

  return deleted;
}
