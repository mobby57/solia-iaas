import { ObjectId } from 'mongodb';
import prisma from '../../lib/prisma';

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toHexString() === id;
}

export function generateObjectId(): string {
  return new ObjectId().toHexString();
}

export async function getDocuments(tenantId: string) {
  return prisma.document.findMany({ where: { tenantId } });
}

export async function getDocumentById(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format for document id');
  }
  return prisma.document.findUnique({ where: { id } });
}

export async function createDocument(data: any, tenantId: string) {
  if (!data.url) {
    throw new Error('Missing required field "url" in document creation data');
  }
  return prisma.document.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateDocument(id: string, data: any) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format for document id');
  }
  try {
    return await prisma.document.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No document found for update with the given id');
    }
    throw error;
  }
}

export async function deleteDocument(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format for document id');
  }
  try {
    return await prisma.document.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No document found for delete with the given id');
    }
    throw error;
  }
}
