import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as notificationService from './notification.service';
import prisma from '../../lib/prisma';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';

let organizationId: string;

describe('Notification Service', () => {
  beforeAll(async () => {
    await cleanDatabase();

    // Create an organization dynamically for tests
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        tenantId: 'test-tenant',
      },
    });
    organizationId = organization.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should get notifications by tenantId', async () => {
    const notifications = await notificationService.getNotifications(organizationId);
    expect(notifications).toBeDefined();
  });

  it('should get notification by id', async () => {
    // Create a notification using the service
    const notification = await notificationService.createNotification(
      {
        title: 'Test Notification',
        message: 'Test message',
      },
      organizationId
    );
    const fetched = await notificationService.getNotificationById(notification.id);
    expect(fetched).toBeDefined();
  });

  it('should create a notification', async () => {
    const notification = await notificationService.createNotification(
      {
        title: 'Test Notification',
        message: 'Test message',
      },
      organizationId
    );
    expect(notification).toBeDefined();
  });

  it('should update a notification', async () => {
    // Create a notification using the service
    const notification = await notificationService.createNotification(
      {
        title: 'Test Notification',
        message: 'Test message',
      },
      organizationId
    );
    const updated = await notificationService.updateNotification(notification.id, {
      title: 'Updated Notification',
      message: 'Updated message',
    });
    expect(updated).toBeDefined();
  });

  it('should delete a notification', async () => {
    // Create a notification using the service
    const notification = await notificationService.createNotification(
      {
        title: 'Test Notification',
        message: 'Test message',
      },
      organizationId
    );
    await notificationService.deleteNotification(notification.id);
    const deleted = await notificationService.getNotificationById(notification.id);
    expect(deleted).toBeNull();
  });
});