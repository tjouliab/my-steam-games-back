import { ZodBrand } from 'src/utils/brand';
import { VisibilityEnum } from 'src/utils/enum/visibility.enum';
import z from 'zod';

export type VisibilityId = number & z.$brand<typeof ZodBrand.VisibilityId>;

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

export const visibilitySchema = z.object({
  id: visibilityIdSchema,
  label: visibilityLabelSchema,
});

export type VisibilityLabel = z.infer<typeof visibilityLabelSchema>;
