import { FastifyInstance } from 'fastify';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../services/document.service';
import { verifyAuth } from '../middlewares/verifyAuth';
import { verifyTenant } from '../middlewares/verifyTenant';
import { verifyRole } from '../middlewares/verifyRole';
import { auditLog } from '../middlewares/auditLog';

export async function documentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);
  fastify.addHook('preHandler', verifyTenant);
  fastify.addHook('preHandler', auditLog);

  fastify.get('/documents', async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const documents = await getDocuments(tenantId);
    reply.send(documents);
  });

  fastify.get('/documents/:id', async (request, reply) => {
    const { id } = request.params as any;
    const document = await getDocumentById(id);
    if (!document) {
      reply.status(404).send({ error: 'Document not found' });
      return;
    }
    reply.send(document);
  });

  fastify.post('/documents', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const tenantId = (request as any).tenantId;
    const documentData = request.body as any;
    const document = await createDocument(documentData, tenantId);
    reply.status(201).send(document);
  });

  fastify.put('/documents/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    const documentData = request.body as any;
    const document = await updateDocument(id, documentData);
    if (!document) {
      reply.status(404).send({ error: 'Document not found' });
      return;
    }
    reply.send(document);
  });

  fastify.delete('/documents/:id', { preHandler: verifyRole(['ADMIN']) }, async (request, reply) => {
    const { id } = request.params as any;
    await deleteDocument(id);
    reply.status(204).send();
  });
}
