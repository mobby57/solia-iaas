import { FastifyInstance } from 'fastify';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/task.service';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyTenant } from '../middlewares/verifyTenant';
import { verifyRole } from '../middlewares/verifyRole';
import { auditLog } from '../middlewares/auditLog';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);
  fastify.addHook('preHandler', verifyTenant);
  fastify.addHook('preHandler', auditLog);

  fastify.get('/tasks', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const tasks = await getTasks(tenantId);
    reply.send(tasks);
  });

  fastify.get('/tasks/:id', async (request, reply) => {
    const { id } = request.params as any;
    const task = await getTaskById(id);
    if (!task) {
      reply.status(404).send({ error: 'Task not found' });
      return;
    }
    reply.send(task);
  });

  fastify.post('/tasks', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const taskData = request.body as any;
    try {
      const task = await createTask(taskData, tenantId);
      reply.status(201).send(task);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create task' });
    }
  });

  fastify.put('/tasks/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    const taskData = request.body as any;
    try {
      const task = await updateTask(id, taskData);
      if (!task) {
        reply.status(404).send({ error: 'Task not found' });
        return;
      }
      reply.send(task);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update task' });
    }
  });

  fastify.delete('/tasks/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    try {
      await deleteTask(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete task' });
    }
  });
}
