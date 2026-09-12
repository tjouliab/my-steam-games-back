import { apiKeySchema } from 'utils/types/api-key';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  STEAM_API_KEY: apiKeySchema,
  DB_FILE_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;
