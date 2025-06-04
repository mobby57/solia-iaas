import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import bcrypt from 'bcrypt';

export function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password, name } = request.body as { email: string; password: string; name: string };

      if (!email || !password || !name) {
        return reply.status(400).send({ error: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(409).send({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return reply.status(201).send({ userId: newUser.id, email: newUser.email, name: newUser.name });
    } catch (error) {
      fastify.log.error('Error registering user:', error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
