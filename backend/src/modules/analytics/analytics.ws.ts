import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const analyticsWebsocket: FastifyPluginCallback = (fastify: any, opts, done) => {
  fastify.register(require('fastify-websocket'));

  fastify.get('/ws/analytics', { websocket: true } as any, (connection: any, req: any) => {
    (connection.socket as any).on('message', async (message: unknown) => {
      const tenantId = (req.headers as any)['x-tenant-id'];
      const data = await (fastify as any).prisma.mission.count({ where: { tenantId } });
      (connection.socket as any).send(JSON.stringify({ count: data }));
    });
  });

  done();
};

export default fp(analyticsWebsocket);
