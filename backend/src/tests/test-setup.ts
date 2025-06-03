import { prisma as originalPrisma } from '../lib/prisma';

const prisma: any = originalPrisma;

export async function globalTestSetup() {
  await prisma.role.createMany({
    data: [
      { name: 'USER', tenantId: 'test-tenant' },
      { name: 'MANAGER', tenantId: 'test-tenant' },
      { name: 'ADMIN', tenantId: 'test-tenant' },
    ],
  });

  await prisma.organization.create({
    data: {
      name: 'Org Test',
      tenantId: 'test-tenant',
    },
  });
}
