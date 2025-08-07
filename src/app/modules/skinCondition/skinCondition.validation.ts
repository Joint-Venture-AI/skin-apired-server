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

const updateSkinConditionZodSchema = z.object({
  skinType: z.string().optional(),
  symptmos: z.string().optional(),
  treatment: z.array(z.string()).optional(),
});

export const SkinConditionValidation = {
  createSkinConditionZodSchema,
  updateSkinConditionZodSchema,
};
