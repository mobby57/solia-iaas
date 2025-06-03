import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function documentRoutes(fastify: FastifyInstance) {
  fastify.get('/documents', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const documents = await prisma.document.findMany();
      return { documents };
    } catch (error) {
      fastify.log.error('Error fetching documents:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/documents/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const document = await prisma.document.findUnique({ where: { id } });
      if (!document) {
        return reply.status(404).send({ error: 'Document not found' });
      }
      return { document };
    } catch (error) {
      fastify.log.error('Error fetching document:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/documents', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const documentData = request.body as any;
      const newDocument = await prisma.document.create({ data: documentData });
      return { document: newDocument };
    } catch (error) {
      fastify.log.error('Error creating document:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/documents/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const documentData = request.body as any;
      const updatedDocument = await prisma.document.update({ where: { id }, data: documentData });
      return { document: updatedDocument };
    } catch (error) {
      fastify.log.error('Error updating document:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/documents/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.document.delete({ where: { id } });
      return { message: 'Document deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting document:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
