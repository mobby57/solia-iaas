import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

interface SignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  tenantId: string;
  organizationName?: string;
  siret?: string;
  apeCode?: string;
  phoneNumber?: string;
  address?: object;
  legalRepresentative?: object;
  identityDoc?: string;
  proofOfAddress?: string;
  proofOfRegistration?: string;
  kbisIfFreelancer?: string;
  consentRGPD?: boolean;
  agreedToCharter?: boolean;
}

interface LoginBody {
  email: string;
  password: string;
  tenantId: string;
}

export async function signupController(request: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) {
  const {
    email,
    password,
    firstName,
    lastName,
    roleId,
    tenantId,
    organizationName,
    siret,
    apeCode,
    phoneNumber,
    address,
    legalRepresentative,
    identityDoc,
    proofOfAddress,
    proofOfRegistration,
    kbisIfFreelancer,
    consentRGPD,
    agreedToCharter,
  } = request.body;

  if (!email || !password || !firstName || !lastName || !roleId || !tenantId) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: 'User already exists' });
    }

    // Create organization if organizationName is provided
    let organization = null;
    if (organizationName) {
      organization = await prisma.organization.create({
        data: {
          name: organizationName,
          siret,
          apeCode,
          email,
          phoneNumber,
          address,
          legalRepresentative,
          proofOfRegistration,
          tenantId,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Compose full name
    const name = `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        organizationId: organization ? organization.id : null,
        roleId,
        tenantId,
        kycData: {
          create: {
            consentRGPD,
            agreedToCharter,
            identityDoc,
            proofOfAddress,
            kbisIfFreelancer,
            proofOfRegistration,
          }
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        tenantId: true,
      },
    });

    // Create documents for identityDoc, proofOfAddress, proofOfRegistration, kbisIfFreelancer if provided
    const documentsToCreate = [];
    if (identityDoc) {
      documentsToCreate.push({
        name: 'Identity Document',
        url: identityDoc,
        organizationId: organization ? organization.id : null,
        tenantId,
      });
    }
    if (proofOfAddress) {
      documentsToCreate.push({
        name: 'Proof of Address',
        url: proofOfAddress,
        organizationId: organization ? organization.id : null,
        tenantId,
      });
    }
    if (proofOfRegistration) {
      documentsToCreate.push({
        name: 'Proof of Registration',
        url: proofOfRegistration,
        organizationId: organization ? organization.id : null,
        tenantId,
      });
    }
    if (kbisIfFreelancer) {
      documentsToCreate.push({
        name: 'Kbis (Freelancer)',
        url: kbisIfFreelancer,
        organizationId: organization ? organization.id : null,
        tenantId,
      });
    }

    for (const doc of documentsToCreate) {
      await prisma.document.create({ data: doc });
    }

    const token = jwt.sign(
      { sub: user.id, tenantId, roleId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return reply.status(201).send({ token, user });
  } catch (error) {
    request.log.error(error);
    console.error('AuthController error:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}

export async function loginController(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
  const { email, password, tenantId } = request.body;

  if (!email || !password || !tenantId) {
    return reply.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { sub: user.id, tenantId, roleId: user.roleId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return reply.status(200).send({ token, user: userWithoutPassword });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}
