import { FastifyInstance } from 'fastify';
import {
  getKycs,
  getKycById,
  createKyc,
  updateKyc,
  deleteKyc,
} from './kyc.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function kycRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/kycs', getKycs);
  fastify.get('/kycs/:id', getKycById);

  fastify.post('/kycs', { preHandler: verifyRole(['ADMIN']) }, createKyc);
  fastify.put('/kycs/:id', { preHandler: verifyRole(['ADMIN']) }, updateKyc);
  fastify.delete('/kycs/:id', { preHandler: verifyRole(['ADMIN']) }, deleteKyc);
}
