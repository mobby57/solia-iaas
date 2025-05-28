import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string(),
  authorId: z.string(),
  // TODO: Add other comment fields as needed
});

export const UpdateCommentSchema = z.object({
  content: z.string().optional(),
  authorId: z.string().optional(),
  // TODO: Add other comment fields as needed
});
