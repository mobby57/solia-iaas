import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);

  const users = [
    {
      id: 'operator-1',
      email: 'operator1@solia.org',
      name: 'Alice Operator',
      role: 'OPERATOR',
      tenantId: 'tenant-france',
      password: hashedPassword,
    },
    {
      id: 'manager-1',
      email: 'manager1@solia.org',
      name: 'Julie Manager',
      role: 'MANAGER',
      tenantId: 'tenant-france',
      password: hashedPassword,
    },
    {
      id: 'donor-1',
      email: 'donor1@example.com',
      name: 'John Donor',
      role: 'DONOR',
      tenantId: 'tenant-france',
      password: hashedPassword,
    },
    {
      id: 'org-admin-1',
      email: 'admin@greenpeace.org',
      name: 'Emma Admin',
      role: 'ASSOCIATION',
      tenantId: 'tenant-greenpeace',
      password: hashedPassword,
    },
  ];

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log('✅ Users seeded.');
}
