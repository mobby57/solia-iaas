import { z } from 'zod';

export const CreateAnalyticsSchema = z.object({
  metric: z.string(),
  value: z.number(),
  // TODO: Add other analytics fields as needed
});

export const UpdateAnalyticsSchema = z.object({
  metric: z.string().optional(),
  value: z.number().optional(),
  // TODO: Add other analytics fields as needed
});
