import { prisma } from '../lib/prisma';
import { seedAll } from '../../prisma/seeds/seedAll';

export async function cleanDatabase() {
  const collections = await prisma.$runCommandRaw({
    listCollections: 1,
  }) as { cursor?: { firstBatch?: Array<{ name: string }> } };

  const collectionNames = collections.cursor?.firstBatch
    ?.map((c: any) => c.name)
    .filter((name: string) => !name.startsWith('system.')) ?? [];

  for (const name of collectionNames) {
    await prisma.$runCommandRaw({
      drop: name,
    });
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export async function resetDatabase() {
  await cleanDatabase();
  await seedAll();
}
