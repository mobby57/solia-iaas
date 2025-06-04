import { FastifyInstance } from 'fastify';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';
import { getAudits, getAuditById, createAudit, updateAudit, deleteAudit } from './audit.controller';

export async function auditRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/audits', getAudits);
  fastify.get('/audits/:id', getAuditById);

  fastify.post('/audits', { preHandler: verifyRole(['ADMIN']) }, createAudit);
  fastify.put('/audits/:id', { preHandler: verifyRole(['ADMIN']) }, updateAudit);
  fastify.delete('/audits/:id', { preHandler: verifyRole(['ADMIN']) }, deleteAudit);
}
