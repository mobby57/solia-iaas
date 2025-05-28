import { z } from 'zod';

export const CreateAuditSchema = z.object({
  action: z.string(),
  userId: z.string(),
  // TODO: Add other audit fields as needed
});

export const UpdateAuditSchema = z.object({
  action: z.string().optional(),
  userId: z.string().optional(),
  // TODO: Add other audit fields as needed
});
