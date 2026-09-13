import { ZodBrand } from 'utils/brand';
import { z } from 'zod';

export const tagIdSchema = z
  .number()
  .int()
  .nonnegative()
  .brand<typeof ZodBrand.TagId>();

export type TagId = z.infer<typeof tagIdSchema>;
