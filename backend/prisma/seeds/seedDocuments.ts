import prisma from '../../src/lib/prisma';

export async function seedDocuments() {
  // Fetch default organization and a user
  const defaultOrg = await prisma.organization.findFirst({ where: { name: 'Default Org' } });
  const user = await prisma.user.findFirst({ where: { email: 'donor.alice@example.com' } });

  if (!defaultOrg || !user) {
    throw new Error('Required default organization or user not found. Please seed base data and users first.');
  }

  // Create documents if they don't exist
  const documents = [
    {
      title: 'Justificatif d\'identité',
      url: 'https://example.com/id-proof.pdf',
      name: 'ID Proof',
      organizationId: defaultOrg.id,
      tenantId: 'default-tenant',
      createdBy: user.id,
      updatedBy: user.id,
    },
    {
      title: 'Mandat SEPA signé',
      url: 'https://example.com/sepa-mandate.pdf',
      name: 'SEPA Mandate',
      organizationId: defaultOrg.id,
      tenantId: 'default-tenant',
      createdBy: user.id,
      updatedBy: user.id,
    },
  ];

  for (const docData of documents) {
    const existingDoc = await prisma.document.findFirst({ where: { title: docData.title } });
    if (!existingDoc) {
      await prisma.document.create({ data: docData });
    }
  }
}
