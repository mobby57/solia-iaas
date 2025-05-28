import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as donationService from './donation.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let donorId: string;
let organizationId: string;
const tenantId = 'test-tenant';

describe('Donation Service', () => {
  beforeEach(async () => {
    await cleanDatabase();

    // Create an organization for relation
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId,
      },
    });
    organizationId = organization.id;

    // Create a donor user for relation
    const donor = await prisma.user.create({
      data: {
        email: 'donor@test.com',
        password: 'password123',
        name: 'Test Donor',
        role: 'USER',
        tenantId,
      },
    });
    donorId = donor.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get donations by tenantId', async () => {
    const donations = await donationService.getDonations(tenantId);
    expect(donations).toBeDefined();
  });

  it('should get donation by id', async () => {
    const created = await prisma.donation.create({
      data: {
        amount: 100,
        date: new Date(),
        tenantId,
        donor: {
          connect: { id: donorId },
        },
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const donation = await donationService.getDonationById(created.id);
    expect(donation).toBeDefined();
  });

  it('should create a donation', async () => {
    const donation = await donationService.createDonation(
      {
        amount: 100,
        date: new Date(),
        donorId,
        organizationId,
      },
      tenantId
    );
    expect(donation).toBeDefined();
  });

  it('should update a donation', async () => {
    const created = await prisma.donation.create({
      data: {
        amount: 100,
        date: new Date(),
        tenantId,
        donor: {
          connect: { id: donorId },
        },
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const updated = await donationService.updateDonation(created.id, {
      amount: 200,
      date: new Date(),
    });
    expect(updated).toBeDefined();
  });

  it('should delete a donation', async () => {
    const created = await prisma.donation.create({
      data: {
        amount: 100,
        date: new Date(),
        tenantId,
        donor: {
          connect: { id: donorId },
        },
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const deleted = await donationService.deleteDonation(created.id);
    expect(deleted.id).toBe(created.id);
  });
});
