import { FastifyReply, FastifyRequest } from 'fastify';

export async function tenantMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Assuming tenantId is passed in headers or extracted from JWT token
    const tenantId = request.headers['x-tenant-id'] as string | undefined;

    if (!tenantId) {
      reply.status(400).send({ error: 'Missing tenantId in request headers' });
      return;
    }

    // Validate tenantId format (ObjectId string)
    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(tenantId)) {
      reply.status(400).send({ error: 'Invalid tenantId format' });
      return;
    }

    // Attach tenantId to request for downstream handlers
    (request as any).tenantId = tenantId;
  } catch (error) {
    reply.status(500).send({ error: 'Internal server error in tenant middleware' });
  }
}
