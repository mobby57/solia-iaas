import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../prismaClient';
import { rbacMiddleware } from '../middlewares/rbac';

export function commentRoutes(fastify: FastifyInstance) {
  fastify.get('/comments', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const comments = await prisma.comment.findMany();
      return { comments };
    } catch (error) {
      fastify.log.error('Error fetching comments:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/comments/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const comment = await prisma.comment.findUnique({ where: { id } });
      if (!comment) {
        return reply.status(404).send({ error: 'Comment not found' });
      }
      return { comment };
    } catch (error) {
      fastify.log.error('Error fetching comment:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.post('/comments', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const commentData = request.body as any;
      const newComment = await prisma.comment.create({ data: commentData });
      return { comment: newComment };
    } catch (error) {
      fastify.log.error('Error creating comment:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.put('/comments/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const commentData = request.body as any;
      const updatedComment = await prisma.comment.update({ where: { id }, data: commentData });
      return { comment: updatedComment };
    } catch (error) {
      fastify.log.error('Error updating comment:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/comments/:id', { preHandler: [fastify.authenticate, rbacMiddleware({ allowedRoles: ['manager', 'operator', 'association'] })] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      await prisma.comment.delete({ where: { id } });
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      fastify.log.error('Error deleting comment:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
