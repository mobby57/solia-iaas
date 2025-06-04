import { FastifyInstance } from 'fastify';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';
import { getTags, getTagById, createTag, updateTag, deleteTag } from './tag.controller';

export async function tagRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/tags', getTags);
  fastify.get('/tags/:id', getTagById);

  fastify.post('/tags', { preHandler: verifyRole(['ADMIN']) }, createTag);
  fastify.put('/tags/:id', { preHandler: verifyRole(['ADMIN']) }, updateTag);
  fastify.delete('/tags/:id', { preHandler: verifyRole(['ADMIN']) }, deleteTag);
}
