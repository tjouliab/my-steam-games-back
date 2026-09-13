import type { VisibilityId } from '../types/visibility';

export const VisibilityEnum = {
  Visible: {
    id: 1 as VisibilityId,
    label: 'Visible',
  },
  HiddenManually: {
    id: 2 as VisibilityId,
    label: 'Hidden Manually',
  },
  HiddenDefault: {
    id: 3 as VisibilityId,
    label: 'Hidden Default',
  },
} as const;
