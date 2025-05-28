import { z } from 'zod';

export const CreateKycSchema = z.object({
  userId: z.string(),
  status: z.string(),
  // TODO: Add other KYC fields as needed
});

export const UpdateKycSchema = z.object({
  userId: z.string().optional(),
  status: z.string().optional(),
  // TODO: Add other KYC fields as needed
});
