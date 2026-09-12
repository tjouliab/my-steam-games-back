import { ZodBrand } from 'utils/brand';
import { z } from 'zod';

export const gameIdSchema = z
  .number()
  .int()
  .positive()
  .brand<typeof ZodBrand.GameId>();

export type GameId = z.infer<typeof gameIdSchema>;
