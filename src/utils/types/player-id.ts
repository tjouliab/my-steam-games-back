import { ZodBrand } from 'src/utils/brand';
import { z } from 'zod';

export const playerIdSchema = z
  .string()
  .nonempty()
  .brand<typeof ZodBrand.PlayerId>();

export type PlayerId = z.infer<typeof playerIdSchema>;
