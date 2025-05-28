import { FastifyReply, FastifyRequest } from 'fastify';
import * as documentService from './document.service';
import { CreateDocumentSchema, UpdateDocumentSchema } from './document.schema';

export async function getDocuments(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const documents = await documentService.getDocuments(tenantId);
    reply.send(documents);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch documents' });
  }
}

export async function getDocumentById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const document = await documentService.getDocumentById(id);
    if (!document) {
      reply.status(404).send({ error: 'Document not found' });
      return;
    }
    reply.send(document);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch document' });
  }
}

export async function createDocument(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const documentData = request.body as any;
  try {
    const document = await documentService.createDocument(documentData, tenantId);
    reply.status(201).send(document);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create document' });
  }
}

export async function updateDocument(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const documentData = request.body as any;
  try {
    const document = await documentService.updateDocument(id, documentData);
    if (!document) {
      reply.status(404).send({ error: 'Document not found' });
      return;
    }
    reply.send(document);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update document' });
  }
}

export async function deleteDocument(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await documentService.deleteDocument(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete document' });
  }
}
