import { createSelectSchema } from 'drizzle-orm/zod';
import { gameIdSchema } from 'utils/types/game-id';
import { gameStatusIdSchema } from 'utils/types/game-status';
import { visibilityIdSchema } from 'utils/types/visibility';
import z from 'zod';
import { games } from '../schema';
import { genreSchema } from './genre.entity';

const gameRecordSchema = createSelectSchema(games, {
  id: gameIdSchema,
  visibilityId: visibilityIdSchema,
  statusId: gameStatusIdSchema.nullable(),
});

export const gameSchema = gameRecordSchema.extend({
  genres: z.array(genreSchema),
});

export type GameEntity = z.infer<typeof gameSchema>;
