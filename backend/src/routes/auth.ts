import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { signup } from '../services/auth';
import { login } from '../services/login';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyTenant } from '../middlewares/verifyTenant';
import { requestPasswordResetController, resetPasswordController, changePasswordController } from '../controllers/authController';

interface SignupBody {
  email: string;
  password: string;
  orgName: string;
}

interface LoginBody {
  email: string;
  password: string;
  tenantId: string;
}

interface RequestPasswordResetBody {
  email: string;
}

interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/signup', async (request: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
    try {
      const { email, password, orgName } = request.body;
      const result = await signup(email, password, orgName, 'default-role-id', 'default-tenant-id');
      if (!result || !result.user) {
        reply.status(500).send({ error: 'Signup failed: no user returned' });
        return;
      }
      reply.status(201).send({
        message: 'Signup successful',
        user: result.user,
        organization: result.organization,
      });
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  fastify.post('/auth/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password, tenantId } = request.body;
      const result = await login(email, password);
      if (!result || !result.user) {
        reply.status(401).send({ error: 'Login failed: invalid credentials' });
        return;
      }
      reply.status(200).send({
        message: 'Login successful',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      reply.status(401).send({ error: (error as Error).message });
    }
  });

  fastify.post('/auth/request-password-reset', async (request: FastifyRequest<{ Body: RequestPasswordResetBody }>, reply: FastifyReply) => {
    try {
      const { email } = request.body;
      await requestPasswordResetController({ email }, reply);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  fastify.post('/auth/reset-password', async (request: FastifyRequest<{ Body: ResetPasswordBody }>, reply: FastifyReply) => {
    try {
      const { token, newPassword } = request.body;
      await resetPasswordController({ token, newPassword }, reply);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  fastify.post('/auth/change-password', { preHandler: [verifyAuth, verifyTenant] }, async (request, reply) => {
    try {
      const userId = (request.user as any)?.sub;
      const { currentPassword, newPassword } = request.body as any;
      await changePasswordController({ userId, currentPassword, newPassword }, reply);
    } catch (error) {
      reply.status(400).send({ error: (error as Error).message });
    }
  });

  // Example protected route
  fastify.get('/auth/profile', { preHandler: [verifyAuth, verifyTenant] }, async (request, reply) => {
    // Return user profile info here
    reply.send({ message: 'Protected profile route' });
  });
}
