import { FastifyInstance } from 'fastify';
import { login, register } from './auth.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/login', login);
  fastify.post('/auth/register', register);

  // Protected routes example (if any)
  // fastify.addHook('preHandler', verifyAuth);
  // fastify.get('/auth/profile', verifyAuth, async (request, reply) => {
  //   // TODO: Implement profile retrieval
  // });
}
