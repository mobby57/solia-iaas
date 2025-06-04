import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../lib/prisma';
import { resetTestDatabase, disconnectDatabase } from '../../tests/resetTestDatabase';

describe('User CRUD operations', () => {
  let userId: string;
  let userCounter = 0;

  beforeAll(async () => {
    await resetTestDatabase();
    // Ensure Donor role exists before creating user
    const donorRole = await prisma.role.upsert({
      where: { name: 'Donor' },
      update: {},
      create: {
        name: 'Donor',
        tenantId: 'default-tenant',
      },
    });
    userCounter++;
    const user = await prisma.user.create({
      data: {
        id: `test-user-id-${userCounter}`, // Auto-generated incremental ID
        email: `testuser${userCounter}@example.com`,
        name: 'Test User',
        password: 'hashedpassword', // Assume password is hashed
        roleId: donorRole.id,
        tenantId: 'default-tenant',
        createdAt: new Date(), // Auto-generated timestamp
        updatedAt: new Date(),
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should create a new user', async () => {
    expect(userId).toBeDefined();
  });

  it('should read a user by id', async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(user).not.toBeNull();
    expect(user?.id).toBe(userId);
  });

  it('should update a user', async () => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: 'Updated User', updatedAt: new Date() },
    });
    expect(updatedUser.name).toBe('Updated User');
  });

  it('should delete a user', async () => {
    if (!userId) throw new Error('userId is undefined');
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    expect(deletedUser.id).toBe(userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).toBeNull();
  });
});
