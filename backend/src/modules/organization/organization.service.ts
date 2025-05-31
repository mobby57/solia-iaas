import prisma from '../../lib/prisma';

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

export async function updateOrganization(id: string, data: any, tenantId: string) {
  const updated = await prisma.organization.updateMany({
    where: { id, tenantId },
    data,
  });

  if (updated.count === 0) {
    throw new Error('No organization found for update with the given id and tenantId');
  }

  return prisma.organization.findUnique({ where: { id } });
}

export async function deleteOrganization(id: string, tenantId: string) {
  // Find the organization first to ensure it exists and belongs to tenant
  const organization = await prisma.organization.findFirst({
    where: { id, tenantId },
  });

  if (!organization) {
    throw new Error('No organization found for delete with the given id and tenantId');
  }

  // Delete by id
  const deleted = await prisma.organization.delete({
    where: { id },
  });

  return deleted;
}
