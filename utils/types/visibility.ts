import { ZodBrand } from 'utils/brand';
import { VisibilityEnum } from 'utils/enum/visibility.enum';
import z from 'zod';

export const visibilityIdSchema = z
  .literal([
    VisibilityEnum.Visible.id,
    VisibilityEnum.HiddenManually.id,
    VisibilityEnum.HiddenDefault.id,
  ])
  .brand<typeof ZodBrand.VisibilityId>();

export const visibilityLabelSchema = z.literal([
  VisibilityEnum.Visible.label,
  VisibilityEnum.HiddenManually.label,
  VisibilityEnum.HiddenDefault.label,
]);

export type VisibilityId = z.infer<typeof visibilityIdSchema>;
export type VisibilityLabel = z.infer<typeof visibilityLabelSchema>;
