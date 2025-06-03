import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import * as taskService from './task.service';
import {prisma} from '../../lib/prisma';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let validTenantId: string;
let validUserId: string;
let validMissionId: string;
let validTaskId: string;

describe('Task Service', () => {
  beforeEach(async () => {
    await cleanDatabase();

    validTenantId = '507f1f77bcf86cd799439011';

    // Create a role for user
    const role = await prisma.role.upsert({
      where: { name: 'TestRole' },
      update: {},
      create: {
        name: 'TestRole',
        tenantId: validTenantId,
      },
    });

    // Create a user
    const user = await prisma.user.create({
      data: {
        email: `testuser_${Date.now()}@example.com`,
        password: 'password',
        name: 'Test User',
        roleId: role.id,
        tenantId: validTenantId,
      },
    });
    validUserId = user.id;

    // Create an organization
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId: validTenantId,
      },
    });

    // Create a mission
    const mission = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        type: 'Test',
        startDate: new Date(),
        endDate: new Date(),
        organizationId: organization.id,
        tenantId: validTenantId,
      },
    });
    validMissionId = mission.id;

    // Create a task
    const task = await prisma.task.create({
      data: {
        userId: validUserId,
        missionId: validMissionId,
        date: new Date(),
        status: 'pending',
        tenantId: validTenantId,
      },
    });
    validTaskId = task.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get tasks by tenantId', async () => {
    const tasks = await taskService.getTasks(validTenantId);
    expect(tasks).toBeDefined();
  });

  it('should get task by id', async () => {
    const task = await taskService.getTaskById(validTaskId);
    expect(task).not.toBeNull();
    expect(task!.tenantId).toBe(validTenantId);
  });

  it('should create a task', async () => {
    const task = await taskService.createTask(
      {
        date: new Date(),
        status: 'pending',
        userId: validUserId,
        missionId: validMissionId,
      },
      validTenantId
    );
    expect(task).not.toBeNull();
    expect(task!.tenantId).toBe(validTenantId);
  });

  it('should update a task', async () => {
    try {
      const task = await taskService.updateTask(validTaskId, {
        status: 'completed',
        date: new Date(),
      }, validTenantId);
      expect(task).not.toBeNull();
      expect(task!.tenantId).toBe(validTenantId);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  });

  it('should throw error if updateTask updates no records', async () => {
    const nonExistentTaskId = '507f1f77bcf86cd799439099';
    await expect(
      taskService.updateTask(nonExistentTaskId, { status: 'completed' }, validTenantId)
    ).rejects.toThrow(/No task found for update with the given id and tenantId|No record was found for an update/);
  });

  it('should delete a task', async () => {
    await taskService.deleteTask(validTaskId, validTenantId);
  });
});