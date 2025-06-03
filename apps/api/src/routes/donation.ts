import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function donationRoutes(fastify: FastifyInstance) {
  fastify.get('/donations', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'donor'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const donations = await prisma.donation.findMany();
      return { donations };
    } catch (error) {
      fastify.log.error('Error fetching donations:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/donations/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'donor'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const donation = await prisma.donation.findUnique({ where: { id } });
      if (!donation) {
        return reply.status(404).send({ error: 'Donation not found' });
      }
      return { donation };
    } catch (error) {
      fastify.log.error('Error fetching donation:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/donations', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['donor'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const donationData = request.body as any;
      const newDonation = await prisma.donation.create({ data: donationData });
      return { donation: newDonation };
    } catch (error) {
      fastify.log.error('Error creating donation:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/donations/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['donor'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const donationData = request.body as any;
      const updatedDonation = await prisma.donation.update({ where: { id }, data: donationData });
      return { donation: updatedDonation };
    } catch (error) {
      fastify.log.error('Error updating donation:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/donations/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['donor'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.donation.delete({ where: { id } });
      return { message: 'Donation deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting donation:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
