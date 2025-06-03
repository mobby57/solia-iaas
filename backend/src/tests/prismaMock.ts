import { prisma as originalPrisma } from '../lib/prisma';

const prismaMock: any = {
  role: {
    createMany: async () => Promise.resolve(),
  },
  organization: {
    create: async () => Promise.resolve(),
  },
  // Add other mocks as needed
};

export { prismaMock };
