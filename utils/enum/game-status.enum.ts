export const gameStatusEnum = {
  Completed: {
    id: 1,
    label: '100%',
  },

  Finished: {
    id: 2,
    label: 'Finished',
  },

  Unfinished: {
    id: 3,
    label: 'Unfinished',
  },

  Abandoned: {
    id: 4,
    label: 'Abandoned',
  },
} as const;
