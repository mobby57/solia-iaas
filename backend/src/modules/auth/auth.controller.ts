import { FastifyReply, FastifyRequest } from 'fastify';
import * as authService from './auth.service';

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  try {
    // TODO: Implement login logic
    const token = await authService.login(body);
    reply.send({ token });
  } catch (_error) {
    reply.status(401).send({ error: 'Invalid credentials' });
  }
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as any;
  try {
    // TODO: Implement registration logic
    const user = await authService.register(body);
    reply.status(201).send(user);
  } catch (_error) {
    reply.status(500).send({ error: 'Registration failed' });
  }
}
