import { ZodBrand } from 'src/utils/brand';
import { z } from 'zod';

export const apiKeySchema = z
  .string()
  .uppercase()
  .brand<typeof ZodBrand.ApiKey>();

export type ApiKey = z.infer<typeof apiKeySchema>;
