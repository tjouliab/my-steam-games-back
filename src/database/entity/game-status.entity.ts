import { gameStatusEnum } from 'utils/enum/game-status.enum';

export type GameStatusEntity =
  (typeof gameStatusEnum)[keyof typeof gameStatusEnum];
