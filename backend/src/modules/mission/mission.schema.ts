import { z } from 'zod';

export const CreateMissionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  // TODO: Add other mission fields as needed
});

export const UpdateMissionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  // TODO: Add other mission fields as needed
});
