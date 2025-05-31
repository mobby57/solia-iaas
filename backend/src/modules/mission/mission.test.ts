import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as missionService from './mission.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let tenantId = '507f1f77bcf86cd799439011';

describe('Mission Service', () => {
  let organizationId: string;

  beforeEach(async () => {
    await cleanDatabase();

    // Create an organization to connect with missions
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId,
      },
    });
    organizationId = organization.id;
  }, 30000);

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  }, 30000);

  it('should get missions by tenantId', async () => {
    const missions = await missionService.getMissions(tenantId);
    expect(missions).toBeDefined();
  }, 30000);

  it('should get mission by id', async () => {
    const created = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        tenantId,
        type: 'Test Type',
        startDate: new Date('2025-06-01T00:00:00.000Z'),
        endDate: new Date('2025-07-01T00:00:00.000Z'),
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const mission = await missionService.getMissionById(created.id);
    expect(mission).toBeDefined();
  }, 30000);

  it('should create a mission', async () => {
    const mission = await missionService.createMission({
      name: 'Test Mission',
      type: 'Test Type',
      startDate: new Date('2025-06-01T00:00:00.000Z'),
      endDate: new Date('2025-07-01T00:00:00.000Z'),
      organization: {
        connect: { id: organizationId },
      },
    }, tenantId);
    expect(mission).toBeDefined();
  }, 30000);

  it('should update a mission', async () => {
    const created = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        tenantId,
        type: 'Test Type',
        startDate: new Date('2025-06-01T00:00:00.000Z'),
        endDate: new Date('2025-07-01T00:00:00.000Z'),
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const updated = await missionService.updateMission(created.id, { name: 'Updated Mission' });
    expect(updated).toBeDefined();
  }, 30000);

  it('should delete a mission', async () => {
    const created = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        tenantId,
        type: 'Test Type',
        startDate: new Date('2025-06-01T00:00:00.000Z'),
        endDate: new Date('2025-07-01T00:00:00.000Z'),
        organization: {
          connect: { id: organizationId },
        },
      },
    });
    const deleted = await missionService.deleteMission(created.id);
    expect(deleted.id).toBe(created.id);
  }, 30000);
});
