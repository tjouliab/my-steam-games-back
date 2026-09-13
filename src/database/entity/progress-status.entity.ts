import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';

export type ProgressStatusEntity =
  (typeof ProgressStatusEnum)[keyof typeof ProgressStatusEnum];
