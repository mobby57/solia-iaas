import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../lib/prisma';
import {
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  createOrganization,
} from '../organization.service';

describe('Organization Service', () => {
  const tenantId1 = 'tenant1';
  const tenantId2 = 'tenant2';
  let orgId: string;

  beforeAll(async () => {
    // Create an organization for testing
    const org = await createOrganization({ name: 'Test Org' }, tenantId1);
    orgId = org.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.organization.deleteMany({
      where: {
        OR: [{ tenantId: tenantId1 }, { tenantId: tenantId2 }],
      },
    });
  });

  describe('getOrganizationById', () => {
    it('should return organization for valid id and tenantId', async () => {
      const org = await getOrganizationById(orgId, tenantId1);
      expect(org).not.toBeNull();
      expect(org?.id).toBe(orgId);
      expect(org?.tenantId).toBe(tenantId1);
    });

    it('should return null for valid id but wrong tenantId', async () => {
      const org = await getOrganizationById(orgId, tenantId2);
      expect(org).toBeNull();
    });
  });

  describe('updateOrganization', () => {
    it('should update organization for valid id and tenantId', async () => {
      const newName = 'Updated Org Name';
      const updated = await updateOrganization(orgId, { name: newName }, tenantId1);
      expect(updated.name).toBe(newName);
    });

    it('should throw error for valid id but wrong tenantId', async () => {
      await expect(updateOrganization(orgId, { name: 'Fail Update' }, tenantId2)).rejects.toThrow(
        'No organization found for update with the given id and tenant',
      );
    });

    it('should throw error for invalid id', async () => {
      await expect(
        updateOrganization('000000000000000000000000', { name: 'Fail Update' }, tenantId1),
      ).rejects.toThrow('No organization found for update with the given id and tenant');
    });
  });

  describe('deleteOrganization', () => {
    it('should throw error for valid id but wrong tenantId', async () => {
      await expect(deleteOrganization(orgId, tenantId2)).rejects.toThrow(
        'No organization found for delete with the given id and tenant',
      );
    });

    it('should throw error for invalid id', async () => {
      await expect(deleteOrganization('000000000000000000000000', tenantId1)).rejects.toThrow(
        'No organization found for delete with the given id and tenant',
      );
    });

    it('should delete organization for valid id and tenantId', async () => {
      const deleted = await deleteOrganization(orgId, tenantId1);
      expect(deleted.id).toBe(orgId);
    });
  });
});
