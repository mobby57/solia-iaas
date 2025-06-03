export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!some-esm-package)/',
  ],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
