import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyTenant(
  request: FastifyRequest & { tenantId?: string },
  reply: FastifyReply,
) {
  const tenantId = request.headers['x-tenant-id'] as string | undefined;
  if (!tenantId) {
    reply.status(400).send({ error: 'Missing tenant ID' });
    return;
  }
  // Attach tenantId to request for downstream usage
  request.tenantId = tenantId;
}
