import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';

export function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await prisma.user.findMany();
      return { users };
    } catch (error) {
      fastify.log.error('Error fetching users:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/users/:id', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }
      return { user };
    } catch (error) {
      fastify.log.error('Error fetching user:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/users', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userData = request.body as any;
      const newUser = await prisma.user.create({ data: userData });
      return { user: newUser };
    } catch (error) {
      fastify.log.error('Error creating user:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/users/:id', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const userData = request.body as any;
      const updatedUser = await prisma.user.update({ where: { id }, data: userData });
      return { user: updatedUser };
    } catch (error) {
      fastify.log.error('Error updating user:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/users/:id', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.user.delete({ where: { id } });
      return { message: 'User deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting user:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
