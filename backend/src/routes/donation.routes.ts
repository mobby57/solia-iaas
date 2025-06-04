import { FastifyInstance } from 'fastify';
import { auditLog } from '../middlewares/auditLog';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyRole } from '../middlewares/verifyRole';
import { verifyTenant } from '../middlewares/verifyTenant';

import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
} from '../services/donation.service';

export async function donationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', tenantMiddleware);
  fastify.addHook('preHandler', verifyTenant);
  fastify.addHook('preHandler', auditLog);

  fastify.get('/donations', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const donations = await getDonations(tenantId);
    reply.send(donations);
  });

  fastify.get('/donations/:id', async (request, reply) => {
    const { id } = request.params as any;
    const donation = await getDonationById(id);
    if (!donation) {
      reply.status(404).send({ error: 'Donation not found' });
      return;
    }
    reply.send(donation);
  });

  fastify.post('/donations', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const donationData = request.body as any;
    try {
      const donation = await createDonation(donationData, tenantId);
      reply.status(201).send(donation);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create donation' });
    }
  });

  fastify.put('/donations/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    const donationData = request.body as any;
    try {
      const donation = await updateDonation(id, donationData);
      if (!donation) {
        reply.status(404).send({ error: 'Donation not found' });
        return;
      }
      reply.send(donation);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update donation' });
    }
  });

  fastify.delete(
    '/donations/:id',
    { preHandler: verifyRole(['ADMIN']) },
    async (request, reply) => {
      const { id } = request.params as any;
      try {
        await deleteDonation(id);
        reply.status(204).send();
      } catch (error) {
        reply.status(500).send({ error: 'Failed to delete donation' });
      }
    },
  );
}
