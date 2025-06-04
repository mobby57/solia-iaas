import { FastifyInstance } from 'fastify';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';
import {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
} from './mission.controller';

export async function missionRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/missions', getMissions);
  fastify.get('/missions/:id', getMissionById);

  fastify.post('/missions', { preHandler: verifyRole(['ADMIN']) }, createMission);
  fastify.put('/missions/:id', { preHandler: verifyRole(['ADMIN']) }, updateMission);
  fastify.delete('/missions/:id', { preHandler: verifyRole(['ADMIN']) }, deleteMission);
}
