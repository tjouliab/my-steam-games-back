import { createSelectSchema } from 'drizzle-orm/zod';
import { gameIdSchema } from 'utils/types/game-id';
import { gameStatusIdSchema } from 'utils/types/game-status';
import { visibilityIdSchema } from 'utils/types/visibility';
import z from 'zod';
import { games } from '../schema';

export const gameSchema = createSelectSchema(games, {
  id: gameIdSchema,
  visibilityId: visibilityIdSchema,
  statusId: gameStatusIdSchema.nullable(),
});

export type GameEntity = z.infer<typeof gameSchema>;
