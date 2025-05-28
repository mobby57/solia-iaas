import { z } from 'zod';

export const CreateTagSchema = z.object({
  name: z.string(),
  // TODO: Add other tag fields as needed
});

export const UpdateTagSchema = z.object({
  name: z.string().optional(),
  // TODO: Add other tag fields as needed
});
