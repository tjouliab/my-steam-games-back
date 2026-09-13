import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { GameId } from 'utils/types/game-id';
import { TagId } from 'utils/types/tag-id';
import { TableNames } from '../table-names';
import { games } from './games.schema';
import { tags } from './tags.schema';

export const gameToTag = sqliteTable(
  TableNames.GameToTag,
  {
    gameId: integer('gameId')
      .$type<GameId>()
      .notNull()
      .references(() => games.id),

    tagId: integer('tagId')
      .$type<TagId>()
      .notNull()
      .references(() => tags.id),
  },
  (table) => [
    primaryKey({
      columns: [table.gameId, table.tagId],
    }),
  ],
);
