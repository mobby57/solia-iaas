import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['solia/backend/src/**/*.test.ts'],
    setupFiles: './solia/backend/src/vitest.setup.ts',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['solia/backend/src/**/*.ts'],
      exclude: ['**/*.test.ts', 'node_modules/'],
    },
  },
});