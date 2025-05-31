import prisma from '../lib/prisma';

export async function getDocuments(tenantId: string) {
  return prisma.document.findMany({ where: { tenantId } });
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}

export async function createDocument(data: any, tenantId: string) {
  // Remove 'type' field if present to avoid Prisma error
  const { type, ...restData } = data;
  return prisma.document.create({
    data: {
      ...restData,
      tenantId,
    },
  });
}

export async function updateDocument(id: string, data: any) {
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
  try {
    return await prisma.document.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No document found for delete with the given id');
    }
    throw error;
  }
}
