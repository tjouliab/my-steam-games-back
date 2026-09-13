import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { ProgressStatusEnum } from '../../../utils/enum/progress-status.enum';
import { TableNames } from '../table-names';
import { populateJob } from './populate-job.schema';
import { progressStatus } from './progress-status.schema';

export const populateJobItem = sqliteTable(
  TableNames.PopulateJobItem,
  {
    jobId: integer('jobId').references(() => populateJob.id),
    gameId: integer('gameId').notNull(),
    progressStatusId: integer('progressStatusId')
      .references(() => progressStatus.id)
      .notNull()
      .default(ProgressStatusEnum.Pending.id),
    attempts: integer('attemps').notNull().default(0),
  },
  (table) => [
    primaryKey({
      columns: [table.jobId, table.gameId],
    }),
  ],
);
