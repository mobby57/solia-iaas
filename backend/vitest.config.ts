import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: './',
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'node',
  },
});
