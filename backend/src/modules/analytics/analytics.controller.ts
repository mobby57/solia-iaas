import { FastifyReply, FastifyRequest } from 'fastify';
import * as analyticsService from './analytics.service';
import { CreateAnalyticsSchema, UpdateAnalyticsSchema } from './analytics.schema';

export async function getAnalytics(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const analytics = await analyticsService.getAnalytics(tenantId);
    reply.send(analytics);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch analytics' });
  }
}

export async function getAnalyticsById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const analytic = await analyticsService.getAnalyticsById(id);
    if (!analytic) {
      reply.status(404).send({ error: 'Analytics record not found' });
      return;
    }
    reply.send(analytic);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch analytics record' });
  }
}

export async function createAnalytics(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const analyticsData = request.body as any;
  try {
    const analytic = await analyticsService.createAnalytics(analyticsData, tenantId);
    reply.status(201).send(analytic);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create analytics record' });
  }
}

export async function updateAnalytics(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const analyticsData = request.body as any;
  try {
    const analytic = await analyticsService.updateAnalytics(id, analyticsData);
    if (!analytic) {
      reply.status(404).send({ error: 'Analytics record not found' });
      return;
    }
    reply.send(analytic);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update analytics record' });
  }
}

export async function deleteAnalytics(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await analyticsService.deleteAnalytics(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete analytics record' });
  }
}
