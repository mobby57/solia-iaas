import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function taskRoutes(fastify: FastifyInstance) {
  fastify.get('/tasks', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tasks = await prisma.task.findMany();
      return { tasks };
    } catch (error) {
      fastify.log.error('Error fetching tasks:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/tasks/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) {
        return reply.status(404).send({ error: 'Task not found' });
      }
      return { task };
    } catch (error) {
      fastify.log.error('Error fetching task:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/tasks', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const taskData = request.body as any;
      const newTask = await prisma.task.create({ data: taskData });
      return { task: newTask };
    } catch (error) {
      fastify.log.error('Error creating task:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/tasks/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const taskData = request.body as any;
      const updatedTask = await prisma.task.update({ where: { id }, data: taskData });
      return { task: updatedTask };
    } catch (error) {
      fastify.log.error('Error updating task:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/tasks/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.task.delete({ where: { id } });
      return { message: 'Task deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting task:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
