import { ZodBrand } from 'utils/brand';
import { z } from 'zod';

export const genreIdSchema = z
  .number()
  .int()
  .nonnegative()
  .brand<typeof ZodBrand.GenreId>();

export type GenreId = z.infer<typeof genreIdSchema>;
