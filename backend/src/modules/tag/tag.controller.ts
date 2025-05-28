import { FastifyReply, FastifyRequest } from 'fastify';
import * as tagService from './tag.service';
import { CreateTagSchema, UpdateTagSchema } from './tag.schema';

export async function getTags(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const tags = await tagService.getTags(tenantId);
    reply.send(tags);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch tags' });
  }
}

export async function getTagById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const tag = await tagService.getTagById(id);
    if (!tag) {
      reply.status(404).send({ error: 'Tag not found' });
      return;
    }
    reply.send(tag);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch tag' });
  }
}

export async function createTag(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const tagData = request.body as any;
  try {
    const tag = await tagService.createTag(tagData, tenantId);
    reply.status(201).send(tag);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create tag' });
  }
}

export async function updateTag(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const tagData = request.body as any;
  try {
    const tag = await tagService.updateTag(id, tagData);
    if (!tag) {
      reply.status(404).send({ error: 'Tag not found' });
      return;
    }
    reply.send(tag);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update tag' });
  }
}

export async function deleteTag(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await tagService.deleteTag(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete tag' });
  }
}
