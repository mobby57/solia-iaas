import { FastifyInstance } from 'fastify';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
} from './donation.controller';

export async function donationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/donations', getDonations);
  fastify.get('/donations/:id', getDonationById);

  fastify.post('/donations', { preHandler: verifyRole(['ADMIN']) }, createDonation);
  fastify.put('/donations/:id', { preHandler: verifyRole(['ADMIN']) }, updateDonation);
  fastify.delete('/donations/:id', { preHandler: verifyRole(['ADMIN']) }, deleteDonation);
}
