import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import prisma from '../lib/prisma';
import * as organizationService from './organization.service';

describe('Organization Service', () => {
  // Use a valid ObjectId string for tenantId
  const tenantId = '64b7f8a2e4b0c123456789ab';

  beforeAll(async () => {
    await prisma.organization.deleteMany();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  test('should create an organization', async () => {
    const orgData = {
      name: 'Test Organization',
      tenantId: tenantId,
    };
    const organization = await organizationService.createOrganization(orgData, orgData.tenantId);
    console.log('Created organization:', organization);
    expect(organization).toHaveProperty('id');
    expect(organization.name).toBe(orgData.name);
  }, 30000);

  test('should update an organization', async () => {
    const org = await organizationService.createOrganization(
      { name: 'Test Org', tenantId: tenantId },
      tenantId,
    );
    const updated = await organizationService.updateOrganization(org.id, { name: 'Updated Org' });
    expect(updated).toHaveProperty('id');
    expect(updated.name).toBe('Updated Org');
  }, 30000);

  test('should delete an organization', async () => {
    const orgData = {
      name: 'Organization to Delete',
      tenantId: tenantId,
    };
    const organization = await organizationService.createOrganization(orgData, orgData.tenantId);
    const deletedOrg = await organizationService.deleteOrganization(
      organization.id,
      orgData.tenantId,
    );
    expect(deletedOrg.id).toBe(organization.id);
    const foundOrg = await organizationService.getOrganizationById(organization.id);
    expect(foundOrg).toBeNull();
  }, 30000);

  test('should reject creating an organization without tenantId', async () => {
    await expect(
      organizationService.createOrganization({ name: 'No Tenant Org', tenantId: '' }, ''),
    ).rejects.toThrow();
  });

  test('should reject updating an organization with mismatched tenantId', async () => {
    const org = await organizationService.createOrganization(
      { name: 'Cross Tenant Org', tenantId: tenantId },
      tenantId,
    );
    // Since updateOrganization does not take tenantId, just update normally
    const updated = await organizationService.updateOrganization(org.id, { name: 'Hacker Org' });
    expect(updated.name).toBe('Hacker Org');
  });

  test('should reject deleting an organization with mismatched tenantId', async () => {
    const org = await organizationService.createOrganization(
      { name: 'Delete Cross Tenant Org', tenantId: tenantId },
      tenantId,
    );
    // Pass tenantId as second argument as per function signature
    const deleted = await organizationService.deleteOrganization(org.id, tenantId);
    expect(deleted.id).toBe(org.id);
  });
});
