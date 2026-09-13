import { VisibilityEnum } from 'utils/enum/visibility.enum';

export type VisibilityEntity =
  (typeof VisibilityEnum)[keyof typeof VisibilityEnum];
