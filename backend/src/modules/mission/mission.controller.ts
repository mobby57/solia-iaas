import { FastifyReply, FastifyRequest } from 'fastify';
import * as missionService from './mission.service';
import { CreateMissionSchema, UpdateMissionSchema } from './mission.schema';

export async function getMissions(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const missions = await missionService.getMissions(tenantId);
    reply.send(missions);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch missions' });
  }
}

export async function getMissionById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const mission = await missionService.getMissionById(id);
    if (!mission) {
      reply.status(404).send({ error: 'Mission not found' });
      return;
    }
    reply.send(mission);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch mission' });
  }
}

export async function createMission(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const missionData = request.body as any;
  try {
    const mission = await missionService.createMission(missionData, tenantId);
    reply.status(201).send(mission);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create mission' });
  }
}

export async function updateMission(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const missionData = request.body as any;
  try {
    const mission = await missionService.updateMission(id, missionData);
    if (!mission) {
      reply.status(404).send({ error: 'Mission not found' });
      return;
    }
    reply.send(mission);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update mission' });
  }
}

export async function deleteMission(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await missionService.deleteMission(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete mission' });
  }
}
