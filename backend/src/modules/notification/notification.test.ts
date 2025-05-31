import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import * as notificationService from '../../services/notification.service';

import { resetDatabase } from '../../tests/testSetup';

describe('NotificationService', () => {
  // Use resetDatabase to clean and seed base data before each test
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should update a notification', async () => {
    // Create a user with valid ObjectId tenantId
    const user = await prisma.user.create({
      data: {
        email: `recipient_${Date.now()}@example.com`,
        password: 'securepassword',
        name: 'Recipient User',
        tenantId: '507f1f77bcf86cd799439011',
        role: {
          create: {
            name: 'RecipientRole',
            tenantId: '507f1f77bcf86cd799439011',
          },
        },
      },
    });

    // Create a notification entity with valid recipientId and tenantId
    const notification = await notificationService.createNotification({
      title: 'New message',
      body: 'You have a new notification',
      recipientId: user.id,
      tenantId: user.tenantId,
      type: 'INFO',
      priority: 'LOW',
    });

    const updated = await notificationService.updateNotification(notification.id, {
      read: true,
    });

    expect(updated.read).toBe(true);
  });
});