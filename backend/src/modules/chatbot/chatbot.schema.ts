import { z } from 'zod';

export const CreateChatbotSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  // TODO: Add other chatbot fields as needed
});

export const UpdateChatbotSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  // TODO: Add other chatbot fields as needed
});
