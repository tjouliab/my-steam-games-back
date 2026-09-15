import { PopulateJobEntity } from 'src/database/entity/populate-job.entity';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { populateJobIdSchema } from 'utils/types/populate-job-id';

export const populateJobFixture: PopulateJobEntity = {
  id: populateJobIdSchema.parse('1'),
  startAt: null,
  finishedAt: null,
  totalGames: 1,
  completedGames: 0,
  progressStatusId: ProgressStatusEnum.Pending.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
