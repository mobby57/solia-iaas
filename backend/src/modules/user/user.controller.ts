import { FastifyReply, FastifyRequest } from 'fastify';
import * as userService from './user.service';
import { CreateUserSchema, UpdateUserSchema } from './user.schema';

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const users = await userService.getUsers(tenantId);
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch users' });
  }
}

export async function getUserById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch user' });
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const userData = request.body as any;
  try {
    const user = await userService.createUser(userData, tenantId);
    reply.status(201).send(user);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create user' });
  }
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const userData = request.body as any;
  try {
    const user = await userService.updateUser(id, userData);
    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }
    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update user' });
  }
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await userService.deleteUser(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete user' });
  }
}
