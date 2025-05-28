import { FastifyInstance } from 'fastify';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from './document.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function documentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/documents', getDocuments);
  fastify.get('/documents/:id', getDocumentById);

  fastify.post('/documents', { preHandler: verifyRole(['ADMIN']) }, createDocument);
  fastify.put('/documents/:id', { preHandler: verifyRole(['ADMIN']) }, updateDocument);
  fastify.delete('/documents/:id', { preHandler: verifyRole(['ADMIN']) }, deleteDocument);
}
