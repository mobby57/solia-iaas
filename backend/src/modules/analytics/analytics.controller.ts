import { FastifyReply, FastifyRequest } from 'fastify';
import * as analyticsService from './analytics.service';

export async function getDashboardData(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;

  try {
    const data = await analyticsService.getDashboardData(tenantId);
    reply.send(data);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch dashboard data' });
  }
}
