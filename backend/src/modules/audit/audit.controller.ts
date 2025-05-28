import { FastifyReply, FastifyRequest } from 'fastify';
import * as auditService from './audit.service';
import { CreateAuditSchema, UpdateAuditSchema } from './audit.schema';

export async function getAudits(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const audits = await auditService.getAudits(tenantId);
    reply.send(audits);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch audits' });
  }
}

export async function getAuditById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const audit = await auditService.getAuditById(id);
    if (!audit) {
      reply.status(404).send({ error: 'Audit not found' });
      return;
    }
    reply.send(audit);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch audit' });
  }
}

export async function createAudit(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const auditData = request.body as any;
  try {
    const audit = await auditService.createAudit(auditData, tenantId);
    reply.status(201).send(audit);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create audit' });
  }
}

export async function updateAudit(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const auditData = request.body as any;
  try {
    const audit = await auditService.updateAudit(id, auditData);
    if (!audit) {
      reply.status(404).send({ error: 'Audit not found' });
      return;
    }
    reply.send(audit);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update audit' });
  }
}

export async function deleteAudit(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await auditService.deleteAudit(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete audit' });
  }
}
