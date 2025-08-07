import { z } from 'zod';

const createSkinConditionZodSchema = z.object({
  skinType: z.string({ required_error: 'Skin type is required' }),
  symptmos: z.string({ required_error: 'Symptoms are required' }),
  treatment: z
    .array(z.string({ required_error: 'Treatment is required' }))
    .nonempty({
      message: 'At least one treatment is required',
    }),
});

export const SkinConditionValidation = {
  createSkinConditionZodSchema,
};
