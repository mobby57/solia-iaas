import prisma from '../../src/lib/prisma';

/**
 * Seed base data required for tests, such as Roles and Organizations.
 */
export async function seedBaseData() {
  // Create default roles if not exist
  const roles = ['admin', 'donor', 'user', 'operator', 'manager', 'association'];
  for (const roleName of roles) {
    const existingRole = await prisma.role.findUnique({ where: { name: roleName } });
    if (!existingRole) {
      await prisma.role.create({ data: { name: roleName, tenantId: 'default-tenant' } });
    }
  }

  // Create a default organization if none exists
  const orgCount = await prisma.organization.count();
  if (orgCount === 0) {
    await prisma.organization.create({
      data: {
        name: 'Default Org',
        tenantId: 'default-tenant',
      },
    });
  }
}
