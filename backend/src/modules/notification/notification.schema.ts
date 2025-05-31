import { z } from 'zod';

export const CreateNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  // TODO: Add other notification fields as needed
});

export const UpdateNotificationSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  // TODO: Add other notification fields as needed
});
