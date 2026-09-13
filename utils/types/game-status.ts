import { ZodBrand } from 'utils/brand';
import { gameStatusEnum } from 'utils/enum/game-status.enum';
import z from 'zod';

export const gameStatusIdSchema = z
  .literal([
    gameStatusEnum.Completed.id,
    gameStatusEnum.Finished.id,
    gameStatusEnum.Unfinished.id,
    gameStatusEnum.Abandoned.id,
  ])
  .brand<typeof ZodBrand.GameStatusId>();

export const gameStatusLabelSchema = z.literal([
  gameStatusEnum.Completed.label,
  gameStatusEnum.Finished.label,
  gameStatusEnum.Unfinished.label,
  gameStatusEnum.Abandoned.label,
]);

export type GameStatusId = z.infer<typeof gameStatusIdSchema>;
export type GameStatusLabel = z.infer<typeof gameStatusLabelSchema>;
