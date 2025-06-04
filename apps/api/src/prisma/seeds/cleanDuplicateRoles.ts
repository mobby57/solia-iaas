import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDuplicateRoles() {
  console.log('Starting cleanup of duplicate Role documents for tenantId "default-tenant"...');

  // Aggregate to find duplicate roles by name and tenantId
  const duplicates = await prisma.role.groupBy({
    by: ['name', 'tenantId'],
    where: { tenantId: 'default-tenant' },
    _count: {
      id: true,
    },
    having: {
      id: {
        _count: {
          gt: 1,
        },
      },
    },
  });

  for (const dup of duplicates) {
    const { name, tenantId } = dup;
    console.log(`Found duplicates for role name: ${name}, tenantId: ${tenantId}`);

    // Find all roles with this name and tenantId, ordered by createdAt ascending
    const roles = await prisma.role.findMany({
      where: { name, tenantId },
      orderBy: { createdAt: 'asc' },
    });

    // Keep the first one, delete the rest
    const rolesToDelete = roles.slice(1);
    for (const role of rolesToDelete) {
      console.log(`Deleting duplicate role with id: ${role.id}`);
      await prisma.role.delete({ where: { id: role.id } });
    }
  }

  console.log('Duplicate Role cleanup completed.');
}

cleanDuplicateRoles()
  .catch((e) => {
    console.error('Error during duplicate Role cleanup:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
