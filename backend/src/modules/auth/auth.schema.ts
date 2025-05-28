import { z } from 'zod';

export const CreateAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const UpdateAuthSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});
