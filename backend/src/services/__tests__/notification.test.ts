import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../lib/prisma';
import { createNotification } from '../notification.service';

describe('Notification Service', () => {
  let user: { id: string; tenantId: string };

  beforeAll(async () => {
    // Find or create role
    let role = await prisma.role.findUnique({
      where: {
        AND: [
          { name: 'RecipientRole' },
          { tenantId: '507f1f77bcf86cd799439011' }
        ]
      },
    });
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: 'RecipientRole',
          tenantId: '507f1f77bcf86cd799439011',
        },
      });
    }

    // Generate unique email to avoid unique constraint violation
    const uniqueEmail = `recipient_${Date.now()}@example.com`;

    // Create a user with valid ObjectId tenantId and existing roleId
    user = await prisma.user.create({
      data: {
        email: u,
        password: 'securepassword',
        name: 'Recipient User',
        tenantId: '507f1f77bcf86cd799439011',
        roleId: role.id,
        role: 'RecipientRole', // Added role field to fix missing argument error
      },
    });
  }, 30000);

  afterAll(async () => {
    if (user) {
      // Clean up: delete the created user and related data
      await prisma.notification.deleteMany({ where: { userId: user.id } });
      // Removed role deletion to avoid foreign key constraint error
      // await prisma.role.deleteMany({ where: { tenantId: user.tenantId } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    await prisma.$disconnect();
  }, 30000);

  it('should create a notification with a valid recipientId', async () => {
    const notificationData = {
      title: 'New message',
      body: 'You have a new notification',
      recipientId: user.id,
      tenantId: user.tenantId,
      type: 'INFO',
      priority: 'MEDIUM',
    };

    const notification = await createNotification(notificationData);

    expect(notification).toBeDefined();
    expect(notification.title).toBe(notificationData.title);
    expect(notification.body).toBe(notificationData.body);
    expect(notification.userId).toBe(user.id);
    expect(notification.tenantId).toBe(user.tenantId);
  }, 30000);
});
