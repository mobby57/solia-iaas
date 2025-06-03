import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function tagRoutes(fastify: FastifyInstance) {
  fastify.get('/tags', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tags = await prisma.tag.findMany();
      return { tags };
    } catch (error) {
      fastify.log.error('Error fetching tags:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/tags/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const tag = await prisma.tag.findUnique({ where: { id } });
      if (!tag) {
        return reply.status(404).send({ error: 'Tag not found' });
      }
      return { tag };
    } catch (error) {
      fastify.log.error('Error fetching tag:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/tags', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tagData = request.body as any;
      const newTag = await prisma.tag.create({ data: tagData });
      return { tag: newTag };
    } catch (error) {
      fastify.log.error('Error creating tag:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/tags/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const tagData = request.body as any;
      const updatedTag = await prisma.tag.update({ where: { id }, data: tagData });
      return { tag: updatedTag };
    } catch (error) {
      fastify.log.error('Error updating tag:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/tags/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.tag.delete({ where: { id } });
      return { message: 'Tag deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting tag:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
