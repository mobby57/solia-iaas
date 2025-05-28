import { FastifyReply, FastifyRequest } from 'fastify';
import * as commentService from './comment.service';
import { CreateCommentSchema, UpdateCommentSchema } from './comment.schema';

export async function getComments(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const comments = await commentService.getComments(tenantId);
    reply.send(comments);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch comments' });
  }
}

export async function getCommentById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const comment = await commentService.getCommentById(id);
    if (!comment) {
      reply.status(404).send({ error: 'Comment not found' });
      return;
    }
    reply.send(comment);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch comment' });
  }
}

export async function createComment(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const commentData = request.body as any;
  try {
    const comment = await commentService.createComment(commentData, tenantId);
    reply.status(201).send(comment);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create comment' });
  }
}

export async function updateComment(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const commentData = request.body as any;
  try {
    const comment = await commentService.updateComment(id, commentData);
    if (!comment) {
      reply.status(404).send({ error: 'Comment not found' });
      return;
    }
    reply.send(comment);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update comment' });
  }
}

export async function deleteComment(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await commentService.deleteComment(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete comment' });
  }
}
