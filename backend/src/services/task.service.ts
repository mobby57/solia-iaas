import { Task } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { prisma } from '../lib/prisma';

function validateObjectId(id: string): string {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new ObjectId(id).toHexString();
}

function validateTenantId(tenantId: string): string {
  if (!tenantId || typeof tenantId !== 'string') {
    throw new Error('TenantId is required and must be a string');
  }
  return tenantId;
}

export async function getTasks(tenantId: string) {
  const validTenantId = validateTenantId(tenantId);
  return prisma.task.findMany({ where: { tenantId: validTenantId } });
}

export async function getTaskById(id: string, tenantId: string) {
  const validId = validateObjectId(id);
  const validTenantId = validateTenantId(tenantId);
  return prisma.task.findFirst({ where: { id: validId, tenantId: validTenantId } });
}

export async function createTask(data: any, tenantId: string) {
  const validTenantId = validateTenantId(tenantId);
  const validUserId = data.userId ? validateObjectId(data.userId) : undefined;

  return prisma.task.create({
    data: {
      ...data,
      tenantId: validTenantId,
      ...(validUserId && { userId: validUserId }),
    },
  });
}

export async function updateTask(id: string, data: Partial<Task>, tenantId: string) {
  const validId = validateObjectId(id);
  const validTenantId = validateTenantId(tenantId);
  const validUserId = data.userId ? validateObjectId(data.userId) : undefined;

  const existing = await prisma.task.findFirst({
    where: {
      id: validId,
      tenantId: validTenantId,
    },
  });

  if (!existing) {
    throw new Error('Task not found or tenant mismatch');
  }

  const updated = await prisma.task.update({
    where: { id: validId },
    data: { ...data, ...(validUserId && { userId: validUserId }) },
  });

  return updated;
}

export async function deleteTask(id: string, tenantId: string) {
  const validId = validateObjectId(id);
  const validTenantId = validateTenantId(tenantId);

  const deleted = await prisma.task.deleteMany({
    where: { id: validId, tenantId: validTenantId },
  });

  if (deleted.count === 0) {
    throw new Error('No task found for delete with the given id and tenantId');
  }

  return deleted;
}
