import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as missionService from './mission.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let tenantId = 'test-tenant';

describe('Mission Service', () => {
  beforeEach(async () => {
    await cleanDatabase();

    // Create tenant or other necessary setup if needed
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get missions by tenantId', async () => {
    const missions = await missionService.getMissions(tenantId);
    expect(missions).toBeDefined();
  });

  it('should get mission by id', async () => {
    const created = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        tenantId,
      },
    });
    const mission = await missionService.getMissionById(created.id);
    expect(mission).toBeDefined();
  });

  it('should create a mission', async () => {
    const mission = await missionService.createMission({ name: 'Test Mission' }, tenantId);
    expect(mission).toBeDefined();
  });

  it('should update a mission', async () => {
    const created = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        tenantId,
      },
    });
    const updated = await missionService.updateMission(created.id, { name: 'Updated Mission' });
    expect(updated).toBeDefined();
  });

  it('should delete a mission', async () => {
    const created = await prisma.mission.create({
      data: {
        name: 'Test Mission',
        tenantId,
      },
    });
    const deleted = await missionService.deleteMission(created.id);
    expect(deleted.id).toBe(created.id);
  });
});