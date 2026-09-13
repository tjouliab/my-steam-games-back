export const ProgressStatusEnum = {
  Pending: {
    id: 1,
    label: 'Pending',
  },
  Running: {
    id: 2,
    label: 'Running',
  },
  Completed: {
    id: 3,
    label: 'Completed',
  },
  Failed: {
    id: 4,
    label: 'Failed',
  },
  Canceled: {
    id: 5,
    label: 'Canceled',
  },
} as const;
