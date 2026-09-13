import { ZodBrand } from 'utils/brand';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import z from 'zod';

export const progressStatusIdSchema = z
  .literal([
    ProgressStatusEnum.Pending.id,
    ProgressStatusEnum.Running.id,
    ProgressStatusEnum.Completed.id,
    ProgressStatusEnum.Failed.id,
    ProgressStatusEnum.Canceled.id,
  ])
  .brand<typeof ZodBrand.ProgressStatusId>();

export const progressStatusLabelSchema = z.literal([
  ProgressStatusEnum.Pending.label,
  ProgressStatusEnum.Running.label,
  ProgressStatusEnum.Completed.label,
  ProgressStatusEnum.Failed.label,
  ProgressStatusEnum.Canceled.label,
]);

export type ProgressStatusId = z.infer<typeof progressStatusIdSchema>;
export type ProgressStatusLabel = z.infer<typeof progressStatusLabelSchema>;
