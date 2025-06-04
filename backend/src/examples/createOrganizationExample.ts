import { ObjectId } from 'bson';
import { prisma, Prisma } from '../lib/prisma';

async function createDefaultOrganization() {
  const data: Prisma.OrganizationCreateInput = {
    id: new ObjectId().toHexString(),
    name: 'Default Org',
    tenantId: 'default-tenant',
  };

  const organization = await prisma.organization.create({
    data,
  });

  console.log('Created organization:', organization);
}

createDefaultOrganization()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
