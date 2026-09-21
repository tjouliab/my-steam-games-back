import { gameSchema } from 'src/database/entity/game.entity';
import { UnbrandNumbers } from 'utils/brand';
import z from 'zod';

export const gamesResponseSchema = gameSchema.array();

export type GamesResponse = UnbrandNumbers<
  z.output<typeof gamesResponseSchema>
>;
