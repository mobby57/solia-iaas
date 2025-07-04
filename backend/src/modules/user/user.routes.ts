import { FastifyInstance } from 'fastify';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from './user.controller';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/users', getUsers);
  fastify.get('/users/:id', getUserById);

  fastify.post('/users', { preHandler: verifyRole(['ADMIN']) }, createUser);
  fastify.put('/users/:id', { preHandler: verifyRole(['ADMIN']) }, updateUser);
  fastify.delete('/users/:id', { preHandler: verifyRole(['ADMIN']) }, deleteUser);
}
