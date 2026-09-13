import { ZodBrand } from 'utils/brand';
import { z } from 'zod';

export const populateJobIdSchema = z
  .string()
  .nonempty()
  .brand<typeof ZodBrand.PopulateJobId>();

export type PopulateJobId = z.infer<typeof populateJobIdSchema>;
