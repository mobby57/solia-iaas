import { PrismaClient } from '@prisma/client';

const dbUri = process.env.TEST_DB_URI || process.env.DATABASE_URL || 'undefined';
console.log(`Prisma connecting to DB URI: ${dbUri}`);

const prisma = new PrismaClient();

type ExtendedPrismaClient = typeof prisma;

declare global {
  // Prevent multiple instances of PrismaClient in development

  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

const globalPrisma: ExtendedPrismaClient = (global as any).prisma || prisma;

async function testConnection() {
  try {
    // Run a simple query to test connection
  } catch (error) {
    console.error('Prisma DB connection error:', error);
  }
}

testConnection();

if (process.env.NODE_ENV !== 'production') (global as any).prisma = globalPrisma;

export { globalPrisma as prisma };
