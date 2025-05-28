import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

async function queueUIRouter(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get('/queue', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok' };
  });
}

export default fastifyPlugin(queueUIRouter);
