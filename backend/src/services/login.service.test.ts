import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import { cleanDatabase, disconnectDatabase, resetDatabase } from '../tests/testSetup';

describe('Login Service', () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  test('should have a placeholder test', () => {
    expect(true).toBe(true);
  });
});
