import { ZodBrand } from 'utils/brand';
import { z } from 'zod';

export const playerIdSchema = z
  .number()
  .int()
  .nonnegative()
  .brand<typeof ZodBrand.PlayerId>();

export type PlayerId = z.infer<typeof playerIdSchema>;
