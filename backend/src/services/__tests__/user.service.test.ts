import { describe, test, expect, beforeAll, afterEach, vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';
import prismaClient from '../../lib/prisma';
import * as userService from '../user.service';

const prisma: PrismaClient = prismaClient;

describe('User Service with caching', () => {
  const tenantId = 'default-tenant';
  let roleId: string;

  beforeAll(async () => {
    // Ensure role exists for tests
    const role = await prisma.role.findFirst({ where: { tenantId, name: 'MANAGER' } });
    if (!role) {
      const createdRole = await prisma.role.create({ data: { name: 'MANAGER', tenantId } });
      roleId = createdRole.id;
    } else {
      roleId = role.id;
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('getUsers calls prisma.user.findMany with cacheStrategy', async () => {
    prisma.user.findMany = vi.fn().mockResolvedValue([{ id: 'user1', tenantId }]);

    const users = await userService.getUsers(tenantId);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { tenantId },
      cacheStrategy: { ttl: 60 },
    });
    expect(users).toEqual([{ id: 'user1', tenantId }]);
  });

  test('getUserById calls prisma.user.findUnique with cacheStrategy', async () => {
    const userId = 'user1';
    prisma.user.findUnique = vi.fn().mockResolvedValue({ id: userId });

    const user = await userService.getUserById(userId);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
      cacheStrategy: { ttl: 60 },
    });
    expect(user).toEqual({ id: userId });
  });

  test('createUser creates a user with hashed password and role', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      role: 'MANAGER',
    };
    prisma.user.create = vi.fn().mockImplementation(async ({ data }: { data: any }) => ({
      id: 'user123',
      ...data,
    }));

    const user = await userService.createUser(userData, tenantId);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe(userData.role);
  });

  test('updateUser updates a user with new data', async () => {
    const userId = 'user123';
    const userData = { name: 'Updated User', password: 'newpassword' };

    prisma.user.findUnique = vi.fn().mockResolvedValue({ id: userId, tenantId });
    prisma.user.update = vi.fn().mockImplementation(async ({ where, data }: { where: any; data: any }) => ({
      id: where.id,
      ...data,
    }));

    const updatedUser = await userService.updateUser(userId, userData, tenantId);
    expect(prisma.user.update).toHaveBeenCalled();
    expect(updatedUser.name).toBe(userData.name);
  });
});
