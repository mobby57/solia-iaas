import { ObjectId } from 'mongodb';
import { describe, it, expect, beforeAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as auditService from './audit.service';

describe('Audit Service', () => {
  const fakeUserId = new ObjectId().toHexString();
  const fakeTenantId = new ObjectId().toHexString();
  let createdAuditId: string;

  beforeAll(async () => {
    // Ensure required related records exist
    const role = await prisma.role.upsert({
      where: { name: 'TestRole' },
      update: {},
      create: {
        name: 'TestRole',
        tenantId: fakeTenantId,
      },
    });

    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await prisma.user.upsert({
      where: { email: uniqueEmail },
      update: {},
      create: {
        id: fakeUserId,
        email: uniqueEmail,
        password: 'password',
        name: 'Test User',
        roleId: role.id,
        tenantId: fakeTenantId,
      },
    });

    // Create an audit record for update and delete tests
    const created = await auditService.createAudit(
      {
        action: 'Initial Action',
        updatedBy: fakeUserId,
        entity: 'TestEntity',
        entityId: new ObjectId().toHexString(),
      },
      fakeTenantId,
    );
    expect(created).toBeDefined();
    createdAuditId = created.id;
  }, 30000);

  it('should get audits by tenantId', async () => {
    const audits = await auditService.getAudits(fakeTenantId);
    expect(audits).toBeDefined();
  }, 30000);

  it('should get audit by id', async () => {
    const audit = await auditService.getAuditById(createdAuditId);
    expect(audit).toBeDefined();
  }, 30000);

  it('should create an audit', async () => {
    const audit = await auditService.createAudit(
      {
        action: 'Test Action',
        updatedBy: fakeUserId,
        entity: 'TestEntity',
        entityId: new ObjectId().toHexString(),
      },
      fakeTenantId,
    );
    expect(audit).toBeDefined();
  }, 30000);

  it('should reject creating an audit without tenantId', async () => {
    await expect(
      auditService.createAudit(
        {
          action: 'No Tenant Action',
          updatedBy: fakeUserId,
          entity: 'TestEntity',
          entityId: new ObjectId().toHexString(),
        },
        '',
      ),
    ).rejects.toThrow();
  });

  it('should update an audit', async () => {
    const audit = await auditService.updateAudit(createdAuditId, { action: 'Updated Action' });
    expect(audit).toBeDefined();
  }, 30000);

  it('should delete an audit', async () => {
    await auditService.deleteAudit(createdAuditId);
    const deleted = await auditService.getAuditById(createdAuditId);
    expect(deleted).toBeNull();
  }, 30000);
});
