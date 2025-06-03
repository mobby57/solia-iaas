import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function organizationRoutes(fastify: FastifyInstance) {
  fastify.get('/organizations', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const organizations = await prisma.organization.findMany();
      return { organizations };
    } catch (error) {
      fastify.log.error('Error fetching organizations:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/organizations/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const organization = await prisma.organization.findUnique({ where: { id } });
      if (!organization) {
        return reply.status(404).send({ error: 'Organization not found' });
      }
      return { organization };
    } catch (error) {
      fastify.log.error('Error fetching organization:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/organizations', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const organizationData = request.body as any;
      const newOrganization = await prisma.organization.create({ data: organizationData });
      return { organization: newOrganization };
    } catch (error) {
      fastify.log.error('Error creating organization:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/organizations/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const organizationData = request.body as any;
      const updatedOrganization = await prisma.organization.update({ where: { id }, data: organizationData });
      return { organization: updatedOrganization };
    } catch (error) {
      fastify.log.error('Error updating organization:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/organizations/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.organization.delete({ where: { id } });
      return { message: 'Organization deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting organization:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
