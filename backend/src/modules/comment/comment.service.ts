import prisma from '../../lib/prisma';

export async function getComments(tenantId: string) {
  return prisma.comment.findMany({ where: { tenantId } });
}

export async function getCommentById(id: string) {
  return prisma.comment.findUnique({ where: { id } });
}

export async function createComment(data: any, tenantId: string) {
  return prisma.comment.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateComment(id: string, data: any) {
  return prisma.comment.update({
    where: { id },
    data,
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
