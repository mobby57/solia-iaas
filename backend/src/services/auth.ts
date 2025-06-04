import { PrismaClient } from '@prisma/client';
import { hashPassword } from './authUtils';

const prisma = new PrismaClient();

export async function signup(
  email: string,
  password: string,
  name: string,
  roleId: string,
  tenantId: string,
) {
  try {
    console.log('=== SIGNUP INITIATED ===');
    console.log('email:', email);
    console.log('name:', name);
    console.log('roleId:', roleId);
    console.log('tenantId:', tenantId);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log('existingUser:', existingUser);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Check if tenant exists
    const tenantExists = await prisma.user.findFirst({ where: { tenantId } });
    if (!tenantExists) {
      throw new Error(`Tenant with id ${tenantId} does not exist`);
    }

    // Create organization instead of tenant
    const organization = await prisma.organization.create({ data: { name, tenantId } });
    console.log('organization created:', organization);

    const hashedPassword = await hashPassword(password);
    console.log('password hashed');

    // Create user with organizationId and roleId
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        organizationId: organization.id,
        roleId,
        tenantId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        organizationId: true,
        roleId: true,
        tenantId: true,
      },
    });
    console.log('user created:', user);

    return { user, organization };
  } catch (error) {
    console.error('Error in signup:', error);
    throw error;
  }
}
