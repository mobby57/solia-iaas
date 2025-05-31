import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as userService from '../../services/user.service';

import { resetDatabase } from '../../tests/testSetup';

describe('UserService', () => {
  // Use resetDatabase to clean and seed base data before each test
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a user', async () => {
    // Ensure a role exists before creating users
    const role = await prisma.role.findUnique({ where: { name: 'TestRole' } });

    // Create user with all required fields
    const user = await userService.createUser({
      email: `newuser+${Date.now()}@example.com`,
      password: 'securePassword',
      name: 'New User',
      roleId: role?.id,
    }, 'tenant-123');

    expect(user.email).toContain('@example.com');
    expect(user.name).toBe('New User');
  });
});
