import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function getOrganizations({ tenantId }: { tenantId: string; }): Promise<{ tenantId: string; createdAt: Date; updatedAt: Date; createdBy: string | null; updatedBy: string | null; id: string; name: string; }[]> {
  return prisma.organization.findMany({ where: { tenantId } });
}

export async function getOrganizationById(id: string, tenantId: string) {
  return prisma.organization.findFirst({
    where: { id, tenantId },
  });
}

export async function createOrganization(data: Omit<Prisma.OrganizationCreateInput, 'tenantId'>, tenantId: string) {
  return prisma.organization.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateOrganization(id: string, data: any, tenantId: string) {
  const existing = await prisma.organization.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error('No organization found for update with the given id and tenant');
  }
  return prisma.organization.update({
    where: { id },
    data: data,
  });
}

export async function deleteOrganization(id: string, tenantId: string) {
  const existing = await prisma.organization.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error('No organization found for delete with the given id and tenant');
  }
  return prisma.organization.delete({
    where: { id },
  });
}
