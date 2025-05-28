import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  // TODO: Add other document fields as needed
});

export const UpdateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  // TODO: Add other document fields as needed
});
