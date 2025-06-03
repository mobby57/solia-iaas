import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { updateUser, createUser } from './user.service';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { resetTestDatabase, disconnectDatabase } from '../tests/resetTestDatabase';

describe('User Service', () => {
  beforeAll(async () => {
    await resetTestDatabase();
    // Ensure USER role exists for tests
    await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: {
        name: 'USER',
        tenantId: 'default-tenant',
      },
    });
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should update a user', async () => {
    // Reuse seeded role
    try {
      const role = await prisma.role.findFirst({ where: { tenantId: 'default-tenant' } });
      if (!role) throw new Error('Role not found in test setup');
      const roleId = role.id;
      const user = await createUser({ email: 'test@example.com', password: 'password', name: 'Original User', roleId, tenantId: 'default-tenant' }, 'default-tenant');
      const userId = user.id;
      const updatedUser = await updateUser(userId, { name: 'Updated User' }, 'default-tenant');
      expect(updatedUser.name).toBe('Updated User');
    } catch (error) {
      console.error('Error in update user test:', error);
      throw error;
    }
  }, 20000);

  it('should create a user with hashed password and role', async () => {
    try {
      const role = await prisma.role.findFirst({ where: { tenantId: 'default-tenant' } });
      if (!role) throw new Error('Role not found in test setup');
      const roleId = role.id;

      const plainPassword = 'MySecret123!';
      const user = await createUser(
        {
          email: 'newuser@example.com',
          password: plainPassword,
          name: 'New User',
          roleId,
          tenantId: 'default-tenant',
        },
        'default-tenant'
      );

      expect(user.email).toBe('newuser@example.com');
      expect(user.roleId).toBe(roleId);
      expect(user.tenantId).toBe('default-tenant');
      expect(user.password).not.toBe(plainPassword);

      // Verify password is hashed
      const isPasswordHashed = await bcrypt.compare(plainPassword, user.password);
      expect(isPasswordHashed).toBe(true);
    } catch (error) {
      console.error('Error in create user test:', error);
      throw error;
    }
  }, 20000);

  it('should reject creating a user without tenantId', async () => {
    try {
      const role = await prisma.role.findFirst({ where: { tenantId: 'default-tenant' } });
      if (!role) throw new Error('Role not found in test setup');
      const roleId = role.id;

      await expect(createUser(
        {
          email: 'notenant@example.com',
          password: 'password',
          name: 'No Tenant User',
          roleId,
          tenantId: '', // empty tenantId
        },
        ''
      )).rejects.toThrow();
    } catch (error) {
      console.error('Error in reject create user without tenantId test:', error);
      throw error;
    }
  }, 20000);

  it('should reject updating a user with mismatched tenantId', async () => {
    try {
      const role = await prisma.role.findFirst({ where: { tenantId: 'default-tenant' } });
      if (!role) throw new Error('Role not found in test setup');
      const roleId = role.id;

      const user = await createUser({ email: 'cross@example.com', password: 'password', name: 'Cross Tenant User', roleId, tenantId: 'default-tenant' }, 'default-tenant');
      const userId = user.id;

      // Attempt to update with wrong tenantId
      await expect(updateUser(userId, { name: 'Hacker' }, 'wrong-tenant')).rejects.toThrow();
    } catch (error) {
      console.error('Error in reject update user with mismatched tenantId test:', error);
      throw error;
    }
  }, 20000);
});
