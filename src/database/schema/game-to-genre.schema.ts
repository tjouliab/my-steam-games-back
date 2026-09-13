import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { GameId } from 'utils/types/game-id';
import { GenreId } from 'utils/types/genre-id';
import { TableNames } from '../table-names';
import { games } from './games.schema';
import { genres } from './genres.schema';

export const gameToGenre = sqliteTable(
  TableNames.GameToGenre,
  {
    gameId: integer('gameId')
      .$type<GameId>()
      .notNull()
      .references(() => games.id),

    genreId: integer('genreId')
      .$type<GenreId>()
      .notNull()
      .references(() => genres.id),
  },
  (table) => [
    primaryKey({
      columns: [table.gameId, table.genreId],
    }),
  ],
);
