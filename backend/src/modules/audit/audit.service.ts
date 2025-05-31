import prisma from '../../lib/prisma';

export async function getAudits(tenantId: string) {
  return prisma.audit.findMany({ where: { tenantId } });
}

export async function getAuditById(id: string) {
  return prisma.audit.findUnique({ where: { id } });
}

export async function createAudit(data: any, tenantId: string) {
  if (!data.updatedBy) {
    throw new Error('Missing required field updatedBy in audit data');
  }
  return prisma.audit.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateAudit(id: string, data: any) {
  try {
    return await prisma.audit.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No audit found for update with the given id');
    }
    throw error;
  }
}

export async function deleteAudit(id: string) {
  try {
    return await prisma.audit.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No audit found for delete with the given id');
    }
    throw error;
  }
}
