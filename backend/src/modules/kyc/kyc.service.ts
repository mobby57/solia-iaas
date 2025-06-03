import {prisma} from '../../lib/prisma';

export async function getKycFieldConfigsByRole(roleId: string, tenantId: string) {
  return prisma.kYCFieldConfig.findMany({
    where: {
      roleId,
      tenantId,
    },
  });
}

export async function getKycFieldConfigs(tenantId: string) {
  return prisma.kYCFieldConfig.findMany({ where: { tenantId } });
}

export async function getKycFieldConfigById(id: string) {
  return prisma.kYCFieldConfig.findUnique({ where: { id } });
}

export async function createKycFieldConfig(data: any, tenantId: string) {
  return prisma.kYCFieldConfig.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateKycFieldConfig(id: string, data: any) {
  return prisma.kYCFieldConfig.update({
    where: { id },
    data,
  });
}

export async function deleteKycFieldConfig(id: string) {
  return prisma.kYCFieldConfig.delete({ where: { id } });
}
