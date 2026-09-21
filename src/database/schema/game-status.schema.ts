import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { GameStatusId, GameStatusLabel } from 'src/utils/types/game-status';
import { TableNames } from '../table-names';

export const gameStatus = sqliteTable(TableNames.GameStatus, {
  id: integer('id').$type<GameStatusId>().primaryKey(),
  label: text('label').$type<GameStatusLabel>().notNull().unique(),
});
