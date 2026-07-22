import { describe, it, expect } from 'vitest';
import { loginSchema, reviewSchema, contributionSchema } from '../../src/lib/schemas';

describe('Zod Form Validation Schemas', () => {
  it('loginSchema should validate email and password', () => {
    const valid = loginSchema.safeParse({ email: 'user@example.com', password: 'geoatlas_secret' });
    expect(valid.success).toBe(true);

    const invalid = loginSchema.safeParse({ email: 'not-an-email', password: '123' });
    expect(invalid.success).toBe(false);
  });

  it('reviewSchema should require rating between 1 and 5 and min text length', () => {
    const valid = reviewSchema.safeParse({ rating: 5, text: 'Great place and service!' });
    expect(valid.success).toBe(true);

    const invalidRating = reviewSchema.safeParse({ rating: 6, text: 'Great place' });
    expect(invalidRating.success).toBe(false);
  });

  it('contributionSchema should require valid target table and name', () => {
    const valid = contributionSchema.safeParse({
      target_table: 'entities',
      name: 'Apollo Hospital',
      source: 'OSM',
    });
    expect(valid.success).toBe(true);
  });
});
