import { FastifyInstance } from 'fastify';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { createUser, updateUser, getUserById, getUsers } from '../services/user.service';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', tenantMiddleware);

  fastify.get('/users', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    try {
      const users = await getUsers(tenantId);
      reply.send(users);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to get users' });
    }
  });

  fastify.post('/users', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const userData = request.body as any;

    try {
      const user = await createUser(userData, tenantId);
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create user' });
    }
  });

  fastify.put('/users/:id', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const userId = (request.params as any).id;
    const updateData = request.body as any;

    try {
      const updatedUser = await updateUser(userId, updateData, tenantId);
      reply.send(updatedUser);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update user' });
    }
  });

  fastify.get('/users/:id', async (request, reply) => {
    const userId = (request.params as any).id;

    try {
      const user = await getUserById(userId);
      reply.send(user);
    } catch (error) {
      reply.status(404).send({ error: 'User not found' });
    }
  });
}
