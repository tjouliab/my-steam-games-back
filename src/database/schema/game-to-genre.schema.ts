import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { TableNames } from '../table-names';
import { games } from './games.schema';
import { genres } from './genres.schema';

export const gameToGenre = sqliteTable(
  TableNames.GameToGenre,
  {
    gameId: integer('gameId')
      .notNull()
      .references(() => games.id),

    genreId: integer('genreId')
      .notNull()
      .references(() => genres.id),
  },
  (table) => [
    primaryKey({
      columns: [table.gameId, table.genreId],
    }),
  ],
);
