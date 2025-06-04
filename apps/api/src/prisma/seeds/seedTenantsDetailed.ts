import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTenantsDetailed() {
  console.log('🌱 Seeding detailed tenants...');

  const tenants = [
    {
      id: 'tenant-manager',
      name: 'Manager Tenant',
      tenantId: 'tenant-manager',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tenant-operator',
      name: 'Operator Tenant',
      tenantId: 'tenant-operator',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tenant-teleoperator',
      name: 'Teleoperator Tenant',
      tenantId: 'tenant-teleoperator',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tenant-donor',
      name: 'Donor Tenant',
      tenantId: 'tenant-donor',
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const tenant of tenants) {
    await prisma.organization.upsert({
      where: { id: tenant.id },
      update: {},
      create: tenant,
    });
  }

  console.log('✅ Detailed tenants seeded.');
}
