import { z } from 'zod';

export const PhotoProgessValidation = z.object({
  type: z.enum(['left', 'right', 'front'], {
    errorMap: () => ({ message: 'Type must be left, right, or front' }),
  }),
});
