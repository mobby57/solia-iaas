import { FastifyInstance } from 'fastify';
import {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
} from '../services/mission.service';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyTenant } from '../middlewares/verifyTenant';
import { verifyRole } from '../middlewares/verifyRole';
import { auditLog } from '../middlewares/auditLog';

export async function missionRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);
  fastify.addHook('preHandler', verifyTenant);
  fastify.addHook('preHandler', auditLog);

  fastify.get('/missions', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const missions = await getMissions(tenantId);
    reply.send(missions);
  });

  fastify.get('/missions/:id', async (request, reply) => {
    const { id } = request.params as any;
    const mission = await getMissionById(id);
    if (!mission) {
      reply.status(404).send({ error: 'Mission not found' });
      return;
    }
    reply.send(mission);
  });

  fastify.post('/missions', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const missionData = request.body as any;
    try {
      const mission = await createMission(missionData, tenantId);
      reply.status(201).send(mission);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create mission' });
    }
  });

  fastify.put('/missions/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    const missionData = request.body as any;
    try {
      const mission = await updateMission(id, missionData);
      if (!mission) {
        reply.status(404).send({ error: 'Mission not found' });
        return;
      }
      reply.send(mission);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to update mission' });
    }
  });

  fastify.delete('/missions/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    try {
      await deleteMission(id);
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({ error: 'Failed to delete mission' });
    }
  });
}
