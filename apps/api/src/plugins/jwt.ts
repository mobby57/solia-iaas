import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';

export default fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
  });

fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    // Attach tenantId from JWT payload to request for multi-tenant support
    const payload = request.user as { tenantId?: string };
    if (!payload.tenantId) {
      reply.status(403).send({ error: 'Tenant ID missing in token' });
      return;
    }
    (request as any).tenantId = payload.tenantId;
  } catch (err) {
    fastify.log.error('JWT verification failed:', err);
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

});
