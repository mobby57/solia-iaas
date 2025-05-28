import { FastifyInstance } from 'fastify';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from './task.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/tasks', getTasks);
  fastify.get('/tasks/:id', getTaskById);

  fastify.post('/tasks', { preHandler: verifyRole(['ADMIN']) }, createTask);
  fastify.put('/tasks/:id', { preHandler: verifyRole(['ADMIN']) }, updateTask);
  fastify.delete('/tasks/:id', { preHandler: verifyRole(['ADMIN']) }, deleteTask);
}
