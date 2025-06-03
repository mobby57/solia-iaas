import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  root: './', // inutile ici car c'est la valeur par défaut
  test: {
    include: ['src/**/*.test.ts'], // ou .spec.ts aussi ?
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@models': path.resolve(__dirname, 'src/models'),
    },
  },
});
