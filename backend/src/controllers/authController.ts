import { FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { prisma } from '../models/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function signupController(data: { email: string; password: string; name: string; roleId: string; tenantId: string }, reply: FastifyReply) {
  const { email, password, name, roleId, tenantId } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return reply.status(400).send({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      roleId,
      tenantId,
      createdBy: email,
      updatedBy: email,
    },
  });

  const token = jwt.sign({ sub: user.id, tenantId, roleId, email }, JWT_SECRET, { expiresIn: '7d' });

  return reply.status(201).send({ token, user: { id: user.id, email: user.email, name: user.name, roleId: user.roleId } });
}

export async function loginController(data: { email: string; password: string; tenantId: string }, reply: FastifyReply) {
  const { email, password, tenantId } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return reply.status(401).send({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ sub: user.id, tenantId, roleId: user.roleId, email }, JWT_SECRET, { expiresIn: '7d' });

  return reply.send({ token, user: { id: user.id, email: user.email, name: user.name, roleId: user.roleId } });
}

// Password reset request - send reset token via email (mocked)
export async function requestPasswordResetController(data: { email: string }, reply: FastifyReply) {
  const { email } = data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(400).send({ error: 'Email not found' });
  }
  // Generate a reset token (for demo, use a simple JWT)
  const resetToken = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
  // TODO: Send resetToken via email (mocked here)
  console.log(`Password reset token for ${email}: ${resetToken}`);
  return reply.send({ message: 'Password reset email sent' });
}

// Password reset confirmation - update password using reset token
export async function resetPasswordController(data: { token: string; newPassword: string }, reply: FastifyReply) {
  const { token, newPassword } = data;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.sub;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    return reply.send({ message: 'Password has been reset successfully' });
  } catch (error) {
    return reply.status(400).send({ error: 'Invalid or expired token' });
  }
}

// Password change - authenticated user changes password
export async function changePasswordController(data: { userId: string; currentPassword: string; newPassword: string }, reply: FastifyReply) {
  const { userId, currentPassword, newPassword } = data;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return reply.status(400).send({ error: 'Current password is incorrect' });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  return reply.send({ message: 'Password changed successfully' });
}
