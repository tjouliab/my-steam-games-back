import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { GameId } from 'src/utils/types/game-id';
import { GameStatusId } from 'src/utils/types/game-status';
import { VisibilityId } from 'src/utils/types/visibility';
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
  lastTimePlayed: integer('lastTimePlayed'),
  releaseDate: text('releaseDate').notNull(),
  initialPrice: integer('initialPrice').notNull(),
  personnalScore: integer('personnalScore'),
  personnalNotes: text('personnalNotes'),

  visibilityId: integer('visibilityId')
    .$type<VisibilityId>()
    .references(() => visibility.id)
    .notNull(),
  statusId: integer('statusId')
    .$type<GameStatusId>()
    .references(() => gameStatus.id),

  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});
