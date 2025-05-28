import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { prisma } from './src/models/prisma';

beforeAll(async () => {
  // Setup before all tests
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Optional: reset database state before each test
});

afterEach(async () => {
  // Optional: cleanup after each test
});
