import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

export async function getUsers(tenantId: string) {
  return prisma.user.findMany({ where: { tenantId } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(userData: any, tenantId: string) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      tenantId,
    },
  });
}

export async function updateUser(id: string, userData: any) {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  return prisma.user.update({
    where: { id },
    data: userData,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
