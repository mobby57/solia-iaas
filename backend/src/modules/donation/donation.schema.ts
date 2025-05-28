import { z } from 'zod';

export const CreateDonationSchema = z.object({
  amount: z.number(),
  donorId: z.string(),
  // TODO: Add other donation fields as needed
});

export const UpdateDonationSchema = z.object({
  amount: z.number().optional(),
  donorId: z.string().optional(),
  // TODO: Add other donation fields as needed
});
