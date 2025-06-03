import { FastifyInstance } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function missionRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/missions',
    { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator'] })] },
    async (request, reply) => {
      try {
        const missions = await prisma.mission.findMany();
        return { missions };
      } catch (error) {
        fastify.log.error('Error fetching missions:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
