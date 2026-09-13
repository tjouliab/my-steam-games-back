import { ZodBrand } from 'utils/brand';
import z from 'zod';
import { ProgressStatusEnum } from '../enum/progress-status.enum';

export type ProgressStatusId = number &
  z.$brand<typeof ZodBrand.ProgressStatusId>;

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

export type ProgressStatusLabel = z.infer<typeof progressStatusLabelSchema>;
