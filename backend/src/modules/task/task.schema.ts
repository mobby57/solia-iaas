import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  // TODO: Add other task fields as needed
});

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  // TODO: Add other task fields as needed
});
