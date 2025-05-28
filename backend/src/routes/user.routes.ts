import { FastifyInstance } from 'fastify';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/user.service';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyTenant } from '../middlewares/verifyTenant';
import { auditLog } from '../middlewares/auditLog';
import { verifyRole } from '../middlewares/verifyRole';

export async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);
  fastify.addHook('preHandler', verifyTenant);
  fastify.addHook('preHandler', auditLog);

  fastify.get('/users', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const users = await getUsers(tenantId);
    reply.send(users);
  });

  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params as any;
    const user = await getUserById(id);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.send(user);
  });

  fastify.post('/users', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const userData = request.body as any;
    try {
      const user = await createUser(userData, tenantId);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create user' });
    }
  });

  fastify.put('/users/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    const userData = request.body as any;
    try {
      const user = await updateUser(id, userData);
      if (!user) {
        reply.status(404).send({ error: 'User not found' });
        return;
      }
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update user' });
    }
  });

  fastify.delete('/users/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    try {
      await deleteUser(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete user' });
    }
  });
}
