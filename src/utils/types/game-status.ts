import { ZodBrand } from 'src/utils/brand';
import { GameStatusEnum } from 'src/utils/enum/game-status.enum';
import z from 'zod';

export type GameStatusId = number & z.$brand<typeof ZodBrand.GameStatusId>;

export const gameStatusIdSchema = z
  .literal([
    GameStatusEnum.Completed.id,
    GameStatusEnum.Finished.id,
    GameStatusEnum.Unfinished.id,
    GameStatusEnum.Abandoned.id,
  ])
  .brand<typeof ZodBrand.GameStatusId>();

export const gameStatusLabelSchema = z.literal([
  GameStatusEnum.Completed.label,
  GameStatusEnum.Finished.label,
  GameStatusEnum.Unfinished.label,
  GameStatusEnum.Abandoned.label,
]);

export const gameStatusSchema = z.object({
  id: gameStatusIdSchema,
  label: gameStatusLabelSchema,
});

export type GameStatusLabel = z.infer<typeof gameStatusLabelSchema>;
