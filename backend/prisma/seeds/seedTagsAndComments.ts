import prisma from '../../src/lib/prisma';

export async function seedTagsAndComments() {
  // Fetch a user and default organization
  const user = await prisma.user.findFirst({ where: { email: 'donor.alice@example.com' } });
  const defaultOrg = await prisma.organization.findFirst({ where: { name: 'Default Org' } });

  if (!user || !defaultOrg) {
    throw new Error('Required user or default organization not found. Please seed users and base data first.');
  }

  // Create tags if they don't exist
  const tags = [
    { label: 'VIP', color: '#FFD700', targetId: defaultOrg.id, targetType: 'Organization', tenantId: 'default-tenant', createdBy: user.id, updatedBy: user.id },
    { label: 'Newsletter', color: '#00BFFF', targetId: defaultOrg.id, targetType: 'Organization', tenantId: 'default-tenant', createdBy: user.id, updatedBy: user.id },
    { label: 'Terrain', color: '#32CD32', targetId: defaultOrg.id, targetType: 'Organization', tenantId: 'default-tenant', createdBy: user.id, updatedBy: user.id },
  ];

  for (const tagData of tags) {
    const existingTag = await prisma.tag.findFirst({ where: { label: tagData.label } });
    if (!existingTag) {
      await prisma.tag.create({ data: tagData });
    }
  }

  // Create comments if they don't exist
  const comments = [
    { content: 'Rappel demandé', userId: user.id, targetId: defaultOrg.id, targetType: 'Organization', tenantId: 'default-tenant', createdBy: user.id, updatedBy: user.id },
    { content: 'Arrivé en retard', userId: user.id, targetId: defaultOrg.id, targetType: 'Organization', tenantId: 'default-tenant', createdBy: user.id, updatedBy: user.id },
  ];

  for (const commentData of comments) {
    const existingComment = await prisma.comment.findFirst({ where: { content: commentData.content } });
    if (!existingComment) {
      await prisma.comment.create({ data: commentData });
    }
  }
}
