import { genreIdSchema } from 'utils/types/genre-id';
import z from 'zod';

export const genreSchema = z
  .object({
    id: z.preprocess(Number, genreIdSchema),
    description: z.string().nonempty(),
  })
  .transform((genre) => ({
    id: genre.id,
    description: genre.description,
  }));

export type GenreDto = z.infer<typeof genreSchema>;
