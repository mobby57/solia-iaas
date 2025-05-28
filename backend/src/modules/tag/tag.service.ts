import prisma from '../../lib/prisma';

export async function getTags(tenantId: string) {
  return prisma.tag.findMany({ where: { tenantId } });
}

export async function getTagById(id: string) {
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
  return prisma.tag.update({
    where: { id },
    data,
  });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}
