import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { createMission, updateMission, deleteMission, getMissionById } from './mission.service';
import { resetTestDatabase, disconnectDatabase } from '../tests/resetTestDatabase';

describe('Mission Service', () => {
  const tenantId = 'default-tenant';
  let missionId: string;

  beforeAll(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('should create a mission with tenantId', async () => {
    const mission = await createMission({ name: 'Test Mission', tenantId }, tenantId);
    expect(mission).toHaveProperty('id');
    expect(mission.name).toBe('Test Mission');
    expect(mission.tenantId).toBe(tenantId);
    missionId = mission.id;
  });

  it('should reject creating a mission without tenantId', async () => {
    await expect(createMission({ name: 'No Tenant Mission', tenantId: '' }, '')).rejects.toThrow();
  });

  it('should update a mission', async () => {
    const updated = await updateMission(missionId, { name: 'Updated Mission' });
    expect(updated.name).toBe('Updated Mission');
  });

  it('should delete a mission', async () => {
    const deleted = await deleteMission(missionId);
    expect(deleted.id).toBe(missionId);
    const found = await getMissionById(missionId);
    expect(found).toBeNull();
  });
});
