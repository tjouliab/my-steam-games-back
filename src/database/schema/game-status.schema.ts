import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { GameStatusEntity } from '../entity/game-status.entity';
import { TableNames } from '../table-names';

export const gameStatus = sqliteTable(TableNames.GameStatus, {
  id: integer('id').$type<GameStatusEntity['id']>().primaryKey(),
  label: text('label').$type<GameStatusEntity['label']>().notNull().unique(),
});
