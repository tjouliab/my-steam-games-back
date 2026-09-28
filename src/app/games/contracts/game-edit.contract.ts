import { gameRecordSchema } from 'src/database/entity/game.entity';
import { UnbrandNumbers } from 'src/utils/brand';
import { gameStatusIdSchema } from 'src/utils/types/game-status';
import { personnalScoreSchema } from 'src/utils/types/personnal-score';
import z from 'zod';

export const gameEditSchema = gameRecordSchema
  .pick({ id: true, personnalNotes: true })
  .extend({
    statusId: gameStatusIdSchema,
    personnalScore: personnalScoreSchema,
  });

export type GameEdit = z.output<typeof gameEditSchema>;
export type GameEditBody = UnbrandNumbers<z.output<typeof gameEditSchema>>;
