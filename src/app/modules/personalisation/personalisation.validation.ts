import { z } from 'zod';

export const personalisationValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
  type: z.string().optional(),
  skinLevel: z.string().optional(),
});
