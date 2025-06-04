// vitest.setup.ts
// Basic setup file for Vitest tests

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Example: Setup global test hooks if needed

beforeAll(() => {
  // Runs once before all tests
  console.log('Starting test suite');
});

afterAll(() => {
  // Runs once after all tests
  console.log('Test suite finished');
});

beforeEach(() => {
  // Runs before each test
});

afterEach(() => {
  // Runs after each test
});
