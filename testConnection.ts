import {prisma} from './solia/backend/src/lib/prisma';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Prisma connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting Prisma to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
