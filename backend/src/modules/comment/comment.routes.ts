import { FastifyInstance } from 'fastify';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from './comment.controller';

export async function commentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/comments', getComments);
  fastify.get('/comments/:id', getCommentById);

  fastify.post('/comments', { preHandler: verifyRole(['ADMIN']) }, createComment);
  fastify.put('/comments/:id', { preHandler: verifyRole(['ADMIN']) }, updateComment);
  fastify.delete('/comments/:id', { preHandler: verifyRole(['ADMIN']) }, deleteComment);
}
