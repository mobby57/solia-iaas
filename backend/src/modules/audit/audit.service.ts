import prisma from '../../lib/prisma';

export async function getAudits(tenantId: string) {
  return prisma.audit.findMany({ where: { tenantId } });
}

export async function getAuditById(id: string) {
  return prisma.audit.findUnique({ where: { id } });
}

export async function createAudit(data: any, tenantId: string) {
  return prisma.audit.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateAudit(id: string, data: any) {
  return prisma.audit.update({
    where: { id },
    data,
  });
}

export async function deleteAudit(id: string) {
  return prisma.audit.delete({ where: { id } });
}
