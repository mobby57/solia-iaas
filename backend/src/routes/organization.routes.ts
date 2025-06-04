import { FastifyInstance } from 'fastify';
import { auditLog } from '../middlewares/auditLog';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyRole } from '../middlewares/verifyRole';
import { verifyTenant } from '../middlewares/verifyTenant';

import {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '../services/organization.service';

export async function organizationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', tenantMiddleware);
  fastify.addHook('preHandler', verifyTenant);
  fastify.addHook('preHandler', auditLog);

  fastify.get('/organizations', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const organizations = await getOrganizations({ tenantId });
    reply.send(organizations);
  });

  fastify.get('/organizations/:id', async (request, reply) => {
    const { id } = request.params as any;
    const organization = await getOrganizationById(id);
    if (!organization) {
      reply.status(404).send({ error: 'Organization not found' });
      return;
    }
    reply.send(organization);
  });

  fastify.post('/organizations', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const organizationData = request.body as any;
    try {
      const organization = await createOrganization(organizationData, tenantId);
      reply.status(201).send(organization);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create organization' });
    }
  });

  fastify.put(
    '/organizations/:id',
    { preHandler: verifyRole(['ADMIN']) },
    async (request, reply) => {
      const { id } = request.params as any;
      const organizationData = request.body as any;
      try {
        const organization = await updateOrganization(id, organizationData);
        if (!organization) {
          reply.status(404).send({ error: 'Organization not found' });
          return;
        }
        reply.send(organization);
      } catch (error) {
        reply.status(500).send({ error: 'Failed to update organization' });
      }
    },
  );

  fastify.delete(
    '/organizations/:id',
    { preHandler: verifyRole(['ADMIN']) },
    async (request, reply) => {
      const { id } = request.params as any;
      const tenantId = (request as any).tenantId;
      try {
        await deleteOrganization(id, tenantId);
        reply.status(204).send();
      } catch (error) {
        reply.status(500).send({ error: 'Failed to delete organization' });
      }
    },
  );
}
