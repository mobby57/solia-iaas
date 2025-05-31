import { describe, it, expect, beforeAll } from 'vitest';
import prisma from '../lib/prisma';
import { createTask, updateTask } from './task.service';

describe('Task Service', () => {
  let testTask: any;
  const tenantId = 'default-tenant';

  beforeAll(async () => {
    await prisma.task.deleteMany(); // clean slate
  }, 30000);

  it('should create and update a task with tenantId', async () => {
    testTask = await createTask(
      {
        status: 'pending',
        date: new Date(),
        userId: 'user-id-placeholder', // replace with real user ID if required
        missionId: 'mission-id-placeholder', // replace with real mission ID if required
      },
      tenantId
    );

    expect(testTask).toBeDefined();

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
        userId: 'user-id-placeholder',
        missionId: 'mission-id-placeholder',
      },
      ''
    )).rejects.toThrow();
  });

  it('should reject updating a task with mismatched tenantId', async () => {
    testTask = await createTask(
      {
        status: 'pending',
        date: new Date(),
        userId: 'user-id-placeholder',
        missionId: 'mission-id-placeholder',
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
