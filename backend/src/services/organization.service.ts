import { prisma } from '../models/prisma';

export async function getOrganizations(tenantId: string) {
  return prisma.organization.findMany({ where: { tenantId } });
}

export async function getOrganizationById(id: string) {
  return prisma.organization.findUnique({ where: { id } });
}

export async function createOrganization(data: any, tenantId: string) {
  return prisma.organization.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateOrganization(id: string, data: any) {
  return prisma.organization.update({
    where: { id },
    data,
  });
}

export async function deleteOrganization(id: string) {
  return prisma.organization.delete({ where: { id } });
}
