import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

export async function getUsers(tenantId: string) {
  return prisma.user.findMany({ where: { tenantId }, cacheStrategy: { ttl: 60 } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, cacheStrategy: { ttl: 60 } });
}

export async function createUser(userData: any, tenantId: string) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      tenantId,
      role: userData.role,
    },
  });
}

export async function updateUser(id: string, userData: any, tenantId: string) {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  return prisma.user.update({
    where: { id },
    data: { ...userData, tenantId },
  });
}

export async function deleteUser(id: string) {
  try {
    return await prisma.user.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No user found for delete with the given id');
    }
    throw error;
  }
}
