import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { ProgressStatusEnum } from '../../../utils/enum/progress-status.enum';
import { TableNames } from '../table-names';
import { progressStatus } from './progress-status.schema';

export const populateJob = sqliteTable(TableNames.PopulateJob, {
  id: integer('id').primaryKey({ autoIncrement: true }),
  startAt: integer('startAt', { mode: 'timestamp' }).notNull(),
  finishedAt: integer('finishedAt', { mode: 'timestamp' }),
  totalGames: integer('totalGames').notNull(),
  failedGames: integer('failedGames').notNull().default(0),

  progressStatusId: integer('progressStatusId')
    .references(() => progressStatus.id)
    .notNull()
    .default(ProgressStatusEnum.Pending.id),

  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
