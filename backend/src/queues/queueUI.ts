import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

async function queueUIRouter(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  fastify.get('/queue', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return { status: 'ok' };
  });
}

export default fastifyPlugin(queueUIRouter);
