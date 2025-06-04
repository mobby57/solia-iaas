import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyRole(allowedRoles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
      const userRole = (request.user as any)?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        reply.status(403).send({ error: 'Forbidden: insufficient role permissions' });
        return;
      }
    } catch (_err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };
}
