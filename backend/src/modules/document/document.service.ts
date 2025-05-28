import prisma from '../../lib/prisma';

export async function getDocuments(tenantId: string) {
  return prisma.document.findMany({ where: { tenantId } });
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}

export async function createDocument(data: any, tenantId: string) {
  return prisma.document.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateDocument(id: string, data: any) {
  return prisma.document.update({
    where: { id },
    data,
  });
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}
