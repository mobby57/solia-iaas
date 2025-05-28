import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  // TODO: Add other organization fields as needed
});

export const UpdateOrganizationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  // TODO: Add other organization fields as needed
});
