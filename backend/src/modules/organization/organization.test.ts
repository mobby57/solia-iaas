import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as organizationService from './organization.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let tenantId = 'test-tenant';

describe('Organization Service', () => {
  beforeEach(async () => {
    await cleanDatabase();

    // Create tenant or other necessary setup if needed
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get organizations by tenantId', async () => {
    const organizations = await organizationService.getOrganizations(tenantId);
    expect(organizations).toBeDefined();
  });

  it('should get organization by id', async () => {
    const created = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId,
      },
    });
    const organization = await organizationService.getOrganizationById(created.id);
    expect(organization).toBeDefined();
  });

  it('should create an organization', async () => {
    const organization = await organizationService.createOrganization({ name: 'Test Org' }, tenantId);
    expect(organization).toBeDefined();
  });

  it('should update an organization', async () => {
    const created = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId,
      },
    });
    const updated = await organizationService.updateOrganization(created.id, { name: 'Updated Org' });
    expect(updated).toBeDefined();
  });

  it('should delete an organization', async () => {
    const created = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId,
      },
    });
    const deleted = await organizationService.deleteOrganization(created.id);
    expect(deleted.id).toBe(created.id);
  });
});
