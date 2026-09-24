import { ZodBrand } from 'src/utils/brand';
import { gameStatusEnum } from 'src/utils/enum/game-status.enum';
import z from 'zod';

export type GameStatusId = number & z.$brand<typeof ZodBrand.GameStatusId>;

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

export const gameStatusSchema = z.object({
  id: gameStatusIdSchema,
  label: gameStatusLabelSchema,
});

export type GameStatusLabel = z.infer<typeof gameStatusLabelSchema>;
