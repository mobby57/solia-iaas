import { FastifyReply, FastifyRequest } from 'fastify';

type Role = 'operator' | 'manager' | 'association' | 'donor';

interface RBACOptions {
  allowedRoles: Role[];
}

export function rbacMiddleware(options: RBACOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as { role?: Role };
      if (!user || !user.role) {
        return reply.status(401).send({ error: 'Unauthorized: No role found' });
      }
      if (!options.allowedRoles.includes(user.role)) {
        return reply.status(403).send({ error: 'Forbidden: Insufficient role' });
      }
    } catch (error) {
      request.log.error('RBAC middleware error:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  };
}
