import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as donationService from './donation.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let donorId: string;
let organizationId: string;
const tenantId = '507f1f77bcf86cd799439011';

describe('Donation Service', () => {
  beforeEach(async () => {
    await cleanDatabase();

    // Ensure Role 'USER' exists
    const role = await prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: {
        name: 'USER',
        tenantId,
      },
    });
    console.log('Role upserted:', role);

    // Create an organization for relation
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId,
      },
    });
    organizationId = organization.id;

    // Create a donor user for relation with randomized email
    const donor = await prisma.user.create({
      data: {
        email: `donor+${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test Donor',
        role: {
          connect: { name: 'USER' }
        },
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
    const created = await donationService.createDonation({
      amount: 100,
      date: new Date(),
      donorId,
      organizationId,
    }, tenantId);
    console.log('Update Donation Test - created.id:', created.id);
    console.log('Update Donation Test - tenantId:', tenantId);
    const updated = await donationService.updateDonation(created.id, {
      amount: 200,
      date: new Date(),
    }, tenantId);
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
    const deleted = await donationService.deleteDonation(created.id, tenantId);
    expect(deleted.id).toBe(created.id);
  });
});
