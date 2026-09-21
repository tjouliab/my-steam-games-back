import { PopulateJobEntity } from 'src/database/entity/populate-job.entity';
import { DateUtils } from 'src/utils/date.utils';
import { ProgressStatusEnum } from 'src/utils/enum/progress-status.enum';
import { populateJobIdSchema } from 'src/utils/types/populate-job-id';

export const populateJobFixture: PopulateJobEntity = {
  id: populateJobIdSchema.parse('1'),
  startAt: null,
  finishedAt: null,
  totalGames: 1,
  completedGames: 0,
  progressStatusId: ProgressStatusEnum.Pending.id,
  createdAt: DateUtils.now(),
  updatedAt: DateUtils.now(),
};
