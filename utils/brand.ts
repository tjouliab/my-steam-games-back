export const ZodBrand = {
  ApiKey: 'ApiKey',
  GameId: 'GameId',
  GameStatusId: 'GameStatusId',
  GenreId: 'GenreId',
  PopulateJobId: 'PopulateJobId',
  PlayerId: 'PlayerId',
  ProgressStatusId: 'ProgressStatusId',
  TagId: 'TagId',
  VisibilityId: 'VisibilityId',
} as const;

// TODO: Used by Nestia for retrocompatibility, to delete when Nestia 12 and Typescript 7
export type UnbrandNumbers<T> = T extends number
  ? number
  : T extends readonly (infer Item)[]
    ? UnbrandNumbers<Item>[]
    : T extends object
      ? { [Key in keyof T]: UnbrandNumbers<T[Key]> }
      : T;
