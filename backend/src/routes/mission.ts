import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyTenant } from '../middlewares/verifyTenant';

const prisma = new PrismaClient();

interface MissionBody {
  name: string;
  type: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  organizationId: string;
  tenantId: string;
}

export async function missionRoutes(fastify: FastifyInstance) {
  // Register the route with JWT authentication preHandler
  fastify.post(
    '/missions',
    {
      preHandler: [verifyAuth, verifyTenant],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'type', 'startDate', 'endDate', 'organizationId', 'tenantId'],
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            organizationId: { type: 'string' },
            tenantId: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              organizationId: { type: 'string' },
              tenantId: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, type, startDate, endDate, organizationId, tenantId } = (request.body as MissionBody);

      try {
        const mission = await prisma.mission.create({
          data: {
            name,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            organizationId,
            tenantId,
          },
        });

        return reply.code(201).send(mission);
      } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Failed to create mission' });
      }
    }
  );
}
