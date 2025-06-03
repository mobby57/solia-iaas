import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { signupController, loginController } from '../controllers/authController';
import { verifyJWT } from '../middlewares/verifyJWT';

interface SignupBody {
  email: string;
  password: string;
  name: string;
  roleId: string;
  tenantId: string;
}

interface LoginBody {
  email: string;
  password: string;
  tenantId: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/signup', async (request: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
    return signupController(request, reply);
  });

  fastify.post('/auth/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    return loginController(request, reply);
  });

  // Example protected route using verifyJWT middleware
  fastify.get('/auth/profile', { preHandler: [verifyJWT] }, async (request, reply) => {
    // Return user profile info here
    reply.send({ message: 'Protected profile route', user: (request as any).user });
  });
}
