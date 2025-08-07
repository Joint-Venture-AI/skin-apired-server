import { z } from 'zod';

const createProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  ingredients: z.string().min(1, 'Ingredients are required'),
  howToUse: z
    .array(z.string().min(1, 'How to use steps cannot be empty'))
    .min(1, 'At least one usage instruction is required'),
  skinCondition: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid skin condition ID'),
});

export const ProductValidation = {
  createProductSchema,
};
