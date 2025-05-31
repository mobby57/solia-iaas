import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDashboardData } from './analytics.service';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

const tenantId = '507f1f77bcf86cd799439011';

describe('Analytics Service', () => {
  beforeAll(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get dashboard data by tenantId', async () => {
    const analytics = await getDashboardData(tenantId);
    expect(analytics).toBeDefined();
  });

  // Additional tests can be implemented here
});