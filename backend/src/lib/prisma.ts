import { PrismaClient, Prisma } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const dbUri = process.env.TEST_DB_URI || process.env.DATABASE_URL || 'undefined';
console.log(`Prisma connecting to DB URI: ${dbUri}`);

const extendedPrisma = new PrismaClient().$extends(withAccelerate());

type ExtendedPrismaClient = PrismaClient & typeof extendedPrisma;

declare global {
  // Prevent multiple instances of PrismaClient in development
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

const prisma: ExtendedPrismaClient = global.prisma || extendedPrisma;

async function testConnection() {
  try {
    // Run a simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma DB connection successful');
  } catch (error) {
    console.error('Prisma DB connection error:', error);
  }
}

testConnection();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export { prisma };
