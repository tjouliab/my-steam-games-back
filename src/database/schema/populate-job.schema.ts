import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ProgressStatusEnum } from 'src/utils/enum/progress-status.enum';
import { PopulateJobId } from 'src/utils/types/populate-job-id';
import { ProgressStatusId } from 'src/utils/types/progress-status';
import { TableNames } from '../table-names';
import { progressStatus } from './progress-status.schema';

export const populateJob = sqliteTable(TableNames.PopulateJob, {
  id: integer('id').$type<PopulateJobId>().primaryKey({ autoIncrement: true }),
  startAt: text('startAt'),
  finishedAt: text('finishedAt'),
  totalGames: integer('totalGames').notNull(),
  completedGames: integer('completedGames').notNull().default(0),

  progressStatusId: integer('progressStatusId')
    .$type<ProgressStatusId>()
    .references(() => progressStatus.id)
    .notNull()
    .default(ProgressStatusEnum.Pending.id),

  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});
