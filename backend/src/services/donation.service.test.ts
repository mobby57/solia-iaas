import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { createDonation } from './donation.service';
import { resetTestDatabase } from '../tests/resetTestDatabase';

describe('Donation Service', () => {
  let testUser: any;
  let testOrganization: any;
  const tenantId = 'default-tenant';

  beforeAll(async () => {
    await resetTestDatabase();
  }, 30000);

  beforeEach(async () => {
    // Create a test user with Donor role
    const donorRole = await prisma.role.upsert({
      where: { name: 'Donor' },
      update: {},
      create: {
        name: 'Donor',
        tenantId,
      },
    });

    testUser = await prisma.user.create({
      data: {
        email: `donor_${Date.now()}@example.com`,
        name: 'Test Donor',
        password: 'password123',
        roleId: donorRole.id,
        tenantId,
      },
    });

    // Create a test organization
    testOrganization = await prisma.organization.create({
      data: {
        name: `Test Org ${Date.now()}`,
        tenantId,
      },
    });
  }, 30000);

  afterEach(async () => {
    await prisma.donation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
  }, 30000);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a donation', async () => {
    const donation = await createDonation(
      {
        amount: 100,
        date: new Date(),
        donorId: testUser.id,
        organizationId: testOrganization.id,
      },
      tenantId
    );

    expect(donation).toHaveProperty('id');
    expect(donation.amount).toBe(100);
  }, 30000);

  it('should update a donation', async () => {
    const created = await createDonation(
      {
        amount: 50,
        date: new Date(),
        donorId: testUser.id,
        organizationId: testOrganization.id,
      },
      tenantId
    );

    const updated = await prisma.donation.update({
      where: { id: created.id },
      data: {
        amount: 75,
      },
    });

    expect(updated.amount).toBe(75);
  }, 30000);

  it('should delete a donation', async () => {
    const created = await createDonation(
      {
        amount: 25,
        date: new Date(),
        donorId: testUser.id,
        organizationId: testOrganization.id,
      },
      tenantId
    );

    const deleted = await prisma.donation.delete({
      where: { id: created.id },
    });

    expect(deleted.id).toBe(created.id);
  }, 30000);

  it('should reject creating a donation without tenantId', async () => {
    await expect(createDonation(
      {
        amount: 10,
        date: new Date(),
        donorId: testUser.id,
        organizationId: testOrganization.id,
      },
      ''
    )).rejects.toThrow();
  });

  it('should reject creating a donation with cross-tenant user or organization', async () => {
    // Create another tenant user and organization
    const otherTenantId = 'other-tenant';
    const otherRole = await prisma.role.upsert({
      where: { name: 'Donor' },
      update: {},
      create: {
        name: 'Donor',
        tenantId: otherTenantId,
      },
    });

    const otherUser = await prisma.user.create({
      data: {
        email: `otheruser_${Date.now()}@example.com`,
        name: 'Other User',
        password: 'password123',
        roleId: otherRole.id,
        tenantId: otherTenantId,
      },
    });

    const otherOrganization = await prisma.organization.create({
      data: {
        name: `Other Org ${Date.now()}`,
        tenantId: otherTenantId,
      },
    });

    // Attempt to create donation with mismatched tenant user
    await expect(createDonation(
      {
        amount: 20,
        date: new Date(),
        donorId: otherUser.id,
        organizationId: testOrganization.id,
      },
      tenantId
    )).rejects.toThrow();

    // Attempt to create donation with mismatched tenant organization
    await expect(createDonation(
      {
        amount: 20,
        date: new Date(),
        donorId: testUser.id,
        organizationId: otherOrganization.id,
      },
      tenantId
    )).rejects.toThrow();
  });

});
