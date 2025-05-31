import prisma from '../lib/prisma';
import { ObjectId } from 'mongodb';

export async function seedBaseData() {
  // Ensure base organizations exist
  const orgCount = await prisma.organization.count();
  if (orgCount === 0) {
    await prisma.organization.create({
      data: {
        id: new ObjectId().toHexString(),
        name: 'Default Organization',
        tenantId: 'default-tenant',
      },
    });
  }

  // Ensure base roles exist
  const roles = ['Admin', 'Manager', 'Operator', 'Donor'];
  for (const roleName of roles) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      await prisma.role.create({
        data: {
          name: roleName,
          tenantId: 'default-tenant',
        },
      });
    }
  }
}
