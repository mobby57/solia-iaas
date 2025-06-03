import { describe, it, expect, beforeAll } from 'vitest';
import prisma from '../lib/prisma';
import { createTask, updateTask } from './task.service';

describe('Task Service', () => {
  let testTask: any;
  let testUser: any;
  let testMission: any;

  const tenantId = '64b7f8a2e4b0c123456789ab';

  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.mission.deleteMany();

    // Crée un user de test
    testUser = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId,
        role: 'operator', // ou autre rôle valide
      },
    });

    // Crée une mission de test
    testMission = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        startDate: new Date(),
        endDate: new Date(),
        tenantId,
      },
    });
  }, 30000);

  it('should create and update a task with tenantId', async () => {
    testTask = await createTask(
      {
        status: 'pending',
        date: new Date(),
        userId: testUser.id,
        missionId: testMission.id,
      },
      tenantId
    );

    expect(testTask).toBeDefined();
    expect(testTask.tenantId).toBe(tenantId);

    const updated = await updateTask(
      testTask.id,
      {
        status: 'completed',
        date: new Date(),
      },
      tenantId
    );

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('completed');
  }, 30000);

  it('should reject creating a task without tenantId', async () => {
    await expect(createTask(
      {
        status: 'pending',
        date: new Date(),
        userId: testUser.id,
        missionId: testMission.id,
      },
      ''
    )).rejects.toThrow();
  });

  it('should reject updating a task with mismatched tenantId', async () => {
    testTask = await createTask(
      {
        status: 'pending',
        date: new Date(),
        userId: testUser.id,
        missionId: testMission.id,
      },
      tenantId
    );

    await expect(updateTask(
      testTask.id,
      {
        status: 'completed',
        date: new Date(),
      },
      'wrong-tenant'
    )).rejects.toThrow();
  });
});
