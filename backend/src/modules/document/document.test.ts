import { beforeEach, describe, expect, it } from 'vitest';
import prisma from '../../lib/prisma';
import { createDocument } from '../../services/document.service';

describe('Document Service', () => {
  const tenantId = 'tenant-123';

  beforeEach(async () => {
    await prisma.document.deleteMany();
  });

  it('should create a document', async () => {
    const newDocument = await createDocument({
      title: 'Test Document',
      tenantId,
      url: 'https://example.com/doc.pdf', // valid url added
      name: 'Sample Name' // Removed content field as it does not exist in Prisma model
    }, tenantId);

    expect(newDocument).toHaveProperty('id');
    expect(newDocument.title).toBe('Test Document');
    expect(newDocument.tenantId).toBe(tenantId);
  });
});
