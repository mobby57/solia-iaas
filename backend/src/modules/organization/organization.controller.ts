import { FastifyReply, FastifyRequest } from 'fastify';
import * as organizationService from './organization.service';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from './organization.schema';

export async function getOrganizations(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const organizations = await organizationService.getOrganizations(tenantId);
    reply.send(organizations);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch organizations' });
  }
}

export async function getOrganizationById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const organization = await organizationService.getOrganizationById(id);
    if (!organization) {
      reply.status(404).send({ error: 'Organization not found' });
      return;
    }
    reply.send(organization);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch organization' });
  }
}

export async function createOrganization(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const organizationData = request.body as any;
  try {
    const organization = await organizationService.createOrganization(organizationData, tenantId);
    reply.status(201).send(organization);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create organization' });
  }
}

export async function updateOrganization(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const organizationData = request.body as any;
  const tenantId = (request as any).tenantId;
  try {
    const organization = await organizationService.updateOrganization(id, organizationData, tenantId);
    if (!organization) {
      reply.status(404).send({ error: 'Organization not found' });
      return;
    }
    reply.send(organization);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update organization' });
  }
}

export async function deleteOrganization(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const tenantId = (request as any).tenantId;
  try {
    await organizationService.deleteOrganization(id, tenantId);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete organization' });
  }
}
