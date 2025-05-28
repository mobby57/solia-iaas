import prisma from '../lib/prisma';

export async function cleanDatabase() {
  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.task.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.document.deleteMany();
  // Add other tables as needed
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
