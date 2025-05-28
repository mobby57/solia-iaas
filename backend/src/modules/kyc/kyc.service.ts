import prisma from '../../lib/prisma';

export async function getKycs(tenantId: string) {
  return prisma.kyc.findMany({ where: { tenantId } });
}

export async function getKycById(id: string) {
  return prisma.kyc.findUnique({ where: { id } });
}

export async function createKyc(data: any, tenantId: string) {
  return prisma.kyc.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateKyc(id: string, data: any) {
  return prisma.kyc.update({
    where: { id },
    data,
  });
}

export async function deleteKyc(id: string) {
  return prisma.kyc.delete({ where: { id } });
}
