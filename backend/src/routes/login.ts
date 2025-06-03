import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { login } from '../services/login';

interface LoginBody {
  email: string;
  password: string;
}

export async function loginRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        reply.status(400).send({ error: 'Email and password are required' });
        return;
      }

      const result = await login(email, password);
      reply.status(200).send({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  });
}
