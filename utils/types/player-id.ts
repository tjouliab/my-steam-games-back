import { ZodBrand } from 'utils/brand';
import { z } from 'zod';

export const playerIdSchema = z
  .number()
  .int()
  .positive()
  .brand<typeof ZodBrand.PlayerId>();

export type PlayerId = z.infer<typeof playerIdSchema>;
