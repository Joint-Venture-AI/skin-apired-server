import { z } from 'zod';

const createUserZodSchema = z.object({
  email: z.string({ required_error: 'Email name is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

const updateZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  googleId: z.string().optional(),
  fcmToken: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
};
