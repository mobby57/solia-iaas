import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../lib/prisma';
import * as documentService from '../document.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

const tenantId = 'default-tenant';

describe('Document Service', () => {
  let organizationId: string;

  beforeAll(async () => {
    await cleanDatabase();

    // Create an organization for relation
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
      },
    });
    organizationId = organization.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get documents by tenantId', async () => {
    const documents = await documentService.getDocuments(tenantId);
    expect(documents).toBeDefined();
  });

  it('should get document by id', async () => {
    const created = await prisma.document.create({
      data: {
        name: 'Test Document',
        url: 'https://example.com/doc.pdf',
        tenantId,
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const document = await documentService.getDocumentById(created.id);
    expect(document).toBeDefined();
  });

  it('should create a document', async () => {
    const document = await documentService.createDocument(
      {
        name: 'New Document',
        url: 'https://example.com/newdoc.pdf',
        organizationId,
      },
      tenantId
    );
    expect(document).toBeDefined();
  });

  it('should update a document', async () => {
    const created = await documentService.createDocument(
      {
        name: 'Update Document',
        url: 'https://example.com/updatedoc.pdf',
        organizationId,
      },
      tenantId
    );
    const updated = await documentService.updateDocument(created.id, {
      name: 'Updated Document Name',
    });
    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Document Name');
  });

  it('should delete a document', async () => {
    const created = await prisma.document.create({
      data: {
        name: 'Delete Document',
        url: 'https://example.com/deletedoc.pdf',
        tenantId,
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const deleted = await documentService.deleteDocument(created.id);
    expect(deleted.id).toBe(created.id);
  });
});
