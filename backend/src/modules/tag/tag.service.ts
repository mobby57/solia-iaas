import prisma from '../../lib/prisma';
import { ObjectId } from 'mongodb';

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && (new ObjectId(id)).toHexString() === id;
}

export function generateObjectId(): string {
  return new ObjectId().toHexString();
}

export async function getTags(tenantId: string) {
  return prisma.tag.findMany({ where: { tenantId } });
}

export async function getTagById(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format for tag id');
  }
  return prisma.tag.findUnique({ where: { id } });
}

export async function createTag(data: any, tenantId: string) {
  return prisma.tag.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateTag(id: string, data: any) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format for tag id');
  }
  try {
    return await prisma.tag.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No tag found for update with the given id');
    }
    throw error;
  }
}

export async function deleteTag(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format for tag id');
  }
  try {
    return await prisma.tag.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No tag found for delete with the given id');
    }
    throw error;
  }
}
