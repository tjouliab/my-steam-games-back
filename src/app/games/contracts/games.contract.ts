import { gameSchema } from 'src/database/entity/game.entity';
import { UnbrandNumbers } from 'src/utils/brand';
import { gameStatusSchema } from 'src/utils/types/game-status';
import { visibilitySchema } from 'src/utils/types/visibility';
import z from 'zod';

export const gamesResponseSchema = gameSchema
  .omit({ visibilityId: true, statusId: true })
  .extend({
    visibility: visibilitySchema,
    status: gameStatusSchema.nullable(),
  })
  .array();

export type GamesResponse = UnbrandNumbers<
  z.output<typeof gamesResponseSchema>
>;
