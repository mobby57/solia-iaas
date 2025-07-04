import { FastifyReply, FastifyRequest } from 'fastify';
import * as taskService from './task.service';

export async function getTasks(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const tasks = await taskService.getTasks(tenantId);
    reply.send(tasks);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch tasks' });
  }
}

export async function getTaskById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const task = await taskService.getTaskById(id);
    if (!task) {
      reply.status(404).send({ error: 'Task not found' });
      return;
    }
    reply.send(task);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch task' });
  }
}

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const taskData = request.body as any;
  try {
    const task = await taskService.createTask(taskData, tenantId);
    reply.status(201).send(task);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to create task' });
  }
}

export async function updateTask(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const taskData = request.body as any;
  const tenantId = (request as any).tenantId;
  try {
    const task = await taskService.updateTask(id, taskData, tenantId);
    if (!task) {
      reply.status(404).send({ error: 'Task not found' });
      return;
    }
    reply.send(task);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to update task' });
  }
}

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const tenantId = (request as any).tenantId;
  try {
    await taskService.deleteTask(id, tenantId);
    reply.status(204).send();
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to delete task' });
  }
}
