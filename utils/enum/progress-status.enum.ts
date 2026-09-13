import type { ProgressStatusId } from '../types/progress-status';

export const ProgressStatusEnum = {
  Pending: {
    id: 1 as ProgressStatusId,
    label: 'Pending',
  },
  Running: {
    id: 2 as ProgressStatusId,
    label: 'Running',
  },
  Completed: {
    id: 3 as ProgressStatusId,
    label: 'Completed',
  },
  Failed: {
    id: 4 as ProgressStatusId,
    label: 'Failed',
  },
  Canceled: {
    id: 5 as ProgressStatusId,
    label: 'Canceled',
  },
} as const;
