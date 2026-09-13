import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { PopulateJobId } from 'utils/types/populate-job-id';
import {
  ProgressStatusId,
  progressStatusIdSchema,
} from '../../../utils/types/progress-status';
import { ProgressStatusEnum } from '../../../utils/enum/progress-status.enum';
import { TableNames } from '../table-names';
import { progressStatus } from './progress-status.schema';

export const populateJob = sqliteTable(TableNames.PopulateJob, {
  id: integer('id').$type<PopulateJobId>().primaryKey({ autoIncrement: true }),
  startAt: integer('startAt', { mode: 'timestamp' }).notNull(),
  finishedAt: integer('finishedAt', { mode: 'timestamp' }),
  totalGames: integer('totalGames').notNull(),
  failedGames: integer('failedGames').notNull().default(0),

  progressStatusId: integer('progressStatusId')
    .$type<ProgressStatusId>()
    .references(() => progressStatus.id)
    .notNull()
    .default(progressStatusIdSchema.parse(ProgressStatusEnum.Pending.id)),

  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});
