import { prisma } from '../lib/prisma';

async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma DB connection successful');
  } catch (error) {
    console.error('Prisma DB connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
