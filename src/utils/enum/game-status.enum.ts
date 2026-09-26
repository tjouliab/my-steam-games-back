import type { GameStatusId } from '../types/game-status';

export const GameStatusEnum = {
  Completed: {
    id: 1 as GameStatusId,
    label: '100%',
  },

  Finished: {
    id: 2 as GameStatusId,
    label: 'Finished',
  },

  Unfinished: {
    id: 3 as GameStatusId,
    label: 'Unfinished',
  },

  Abandoned: {
    id: 4 as GameStatusId,
    label: 'Abandoned',
  },
} as const;
