import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { GameId } from 'utils/types/game-id';
import { TableNames } from '../table-names';
import { gameStatus } from './game-status.schema';
import { visibility } from './visibility.schema';

export const games = sqliteTable(TableNames.Games, {
  id: integer('id').$type<GameId>().primaryKey(),
  name: text('name').notNull(),
  imgIconUrl: text('imgIconUrl').notNull(),
  metacriticScore: integer('metacriticScore'),
  positiveReviews: integer('positiveReviews').notNull(),
  negativeReviews: integer('negativeReviews').notNull(),
  playTime: integer('playTime').notNull(),
  lastTimePlayed: text(),
  releaseDate: text().notNull(),
  initialPrice: integer('initialPrice').notNull(),
  personnalScore: integer('personnalScore'),
  personnalNotes: text('personnalNotes'),

  visibilityId: integer('visbilityId').references(() => visibility.id),
  statusId: integer('statusId').references(() => gameStatus.id),

  createdAt: integer({ mode: 'timestamp' }).notNull(),
  updatedAt: integer({ mode: 'timestamp' }).notNull(),
});
