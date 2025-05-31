import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const analyticsWebsocket: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(require('fastify-websocket'));

  fastify.get('/ws/analytics', { websocket: true } as any, (connection: any, req: any) => {
    connection.socket.on('message', async (message: any) => {
      const tenantId = req.headers['x-tenant-id'] as string;
      const data = await fastify.prisma.mission.count({ where: { tenantId } });
      connection.socket.send(JSON.stringify({ count: data }));
    });
  });

  done();
};

export default fp(analyticsWebsocket);
