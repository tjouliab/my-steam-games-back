import z from 'zod';
import { genreSchema } from './genre.dto';

const gameDetailsSchema = z
  .object({
    release_date: z.object({ date: z.date() }),
    metacritic: z.object({ score: z.int() }).optional(),
    genres: z.array(genreSchema).default([]),
    price_overview: z.object({ initial: z.int().nonnegative() }),
  })
  .transform((response) => ({
    releaseDate: response.release_date.date,
    metacriticScore: response?.metacritic?.score,
    genres: response.genres,
    initialPrice: response.price_overview.initial,
  }));

export const gameDetailsReponseSchema = z.record(
  z.string(),
  z.object({
    success: z.boolean(),
    data: gameDetailsSchema,
  }),
);

export type GameDetailsDto = z.infer<typeof gameDetailsSchema>;
