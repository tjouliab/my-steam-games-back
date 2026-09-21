import { ZodBrand } from 'src/utils/brand';
import { z } from 'zod';

export const gameIdSchema = z
  .number()
  .int()
  .nonnegative()
  .brand<typeof ZodBrand.GameId>();

export type GameId = z.infer<typeof gameIdSchema>;
