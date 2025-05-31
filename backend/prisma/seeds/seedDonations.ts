import prisma from '../../src/lib/prisma';

export async function seedDonations() {
  console.log('🌱 Seeding donations...');

  // Example seed data - adapt to your model
  await prisma.donation.createMany({
    data: [
      {
        amount: 50,
        date: new Date(),
        donorId: 'USER_ID_1',
        organizationId: 'ORG_ID_1',
        missionId: 'MISSION_ID_1',
        tenantId: 'default-tenant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        amount: 100,
        date: new Date(),
        donorId: 'USER_ID_2',
        organizationId: 'ORG_ID_2',
        missionId: 'MISSION_ID_2',
        tenantId: 'default-tenant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log('✅ Donations seeded');
}
