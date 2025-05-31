import prisma from '../lib/prisma';

import { seedBaseData } from './seedBaseData';

export async function resetTestDatabase() {
  // Delete child entities first
  await prisma.tag.deleteMany();
  await prisma.task.deleteMany();              // Tasks before Missions
  await prisma.donation.deleteMany();
  await prisma.comment.deleteMany();

  // Delete KYCFieldConfig before roles to avoid FK constraint
  await prisma.kYCFieldConfig.deleteMany();

  // Delete users before roles
  await prisma.user.deleteMany();

  // Then delete parent entities
  await prisma.mission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.organization.deleteMany();

  // Reinsert base roles with tenantId
  for (const roleName of ['Admin', 'Manager', 'Operator', 'Donor']) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, tenantId: 'default-tenant' },
    });
  }

  // Seed base data for tests
  await seedBaseData();

  // Add a small delay to ensure DB consistency before tests run
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('✅ Test database reset complete.');
}

export async function cleanDatabase() {
  await resetTestDatabase();
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
