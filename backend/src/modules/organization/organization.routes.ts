import { FastifyInstance } from 'fastify';
import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from './organization.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function organizationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/organizations', getOrganizations);
  fastify.get('/organizations/:id', getOrganizationById);

  fastify.post('/organizations', { preHandler: verifyRole(['ADMIN']) }, createOrganization);
  fastify.put('/organizations/:id', { preHandler: verifyRole(['ADMIN']) }, updateOrganization);
  fastify.delete('/organizations/:id', { preHandler: verifyRole(['ADMIN']) }, deleteOrganization);
}
