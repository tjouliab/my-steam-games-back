import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { TableNames } from '../table-names';
import { games } from './games.schema';
import { tags } from './tags.schema';

export const gameToTag = sqliteTable(
  TableNames.GameToTag,
  {
    gameId: integer('gameId')
      .notNull()
      .references(() => games.id),

    tagId: integer('tagId')
      .notNull()
      .references(() => tags.id),
  },
  (table) => [
    primaryKey({
      columns: [table.gameId, table.tagId],
    }),
  ],
);
