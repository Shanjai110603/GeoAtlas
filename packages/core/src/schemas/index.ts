import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  display_name: z.string().min(2, 'Display name must be at least 2 characters'),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  text: z.string().min(5, 'Review must be at least 5 characters'),
  photos: z.array(z.string()).optional(),
});

export const contributionSchema = z.object({
  target_table: z.enum(['entities', 'admin_levels', 'reviews', 'relationships']),
  target_id: z.string().nullable().optional(),
  entity_type: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  native_name: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  source: z.string().optional(),
});
