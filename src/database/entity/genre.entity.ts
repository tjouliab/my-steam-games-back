import { createSelectSchema } from 'drizzle-orm/zod';
import { genreIdSchema } from 'utils/types/genre-id';
import z from 'zod';
import { genres } from '../schema';

const genreSchema = createSelectSchema(genres, {
  id: genreIdSchema,
});

export type GenreEntity = z.infer<typeof genreSchema>;
