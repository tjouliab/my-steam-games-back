import { integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { GameId } from 'src/utils/types/game-id';
import { PopulateJobId } from 'src/utils/types/populate-job-id';
import { ProgressStatusEnum } from 'src/utils/enum/progress-status.enum';
import { ProgressStatusId } from 'src/utils/types/progress-status';
import { TableNames } from '../table-names';
import { populateJob } from './populate-job.schema';
import { progressStatus } from './progress-status.schema';

export const populateJobItem = sqliteTable(
  TableNames.PopulateJobItem,
  {
    jobId: integer('jobId')
      .$type<PopulateJobId>()
      .references(() => populateJob.id)
      .notNull(),
    gameId: integer('gameId').$type<GameId>().notNull(),
    progressStatusId: integer('progressStatusId')
      .$type<ProgressStatusId>()
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
