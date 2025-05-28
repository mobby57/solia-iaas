import { describe, it, expect } from 'vitest';
import * as taskService from './task.service';

const validTenantId = '64b7f8f8f8f8f8f8f8f8f8f8'; // example valid ObjectId string
const validTaskId = '64b7f8f8f8f8f8f8f8f8f8f9'; // example valid ObjectId string

describe('Task Service', () => {
  it('should get tasks by tenantId', async () => {
    const tasks = await taskService.getTasks(validTenantId);
    expect(tasks).toBeDefined();
  });

  it('should get task by id', async () => {
    const task = await taskService.getTaskById(validTaskId);
    expect(task).toBeDefined();
  });

  it('should create a task', async () => {
    const task = await taskService.createTask(
      {
        date: new Date(),
        status: 'pending',
        userId: validTaskId,
        missionId: validTaskId,
      },
      validTenantId
    );
    expect(task).toBeDefined();
  });

  it('should update a task', async () => {
    const task = await taskService.updateTask(validTaskId, {
      status: 'completed',
      date: new Date(),
    });
    expect(task).toBeDefined();
  });

  it('should delete a task', async () => {
    await taskService.deleteTask(validTaskId);
  });
});
