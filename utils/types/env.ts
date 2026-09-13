import { apiKeySchema } from 'utils/types/api-key';
import { z } from 'zod';
import { playerIdSchema } from './player-id';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  STEAM_API_KEY: apiKeySchema,

  PLAYER_ID: playerIdSchema,
  FAMILY_PLAYER_ID: z.array(playerIdSchema),

  DB_FILE_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;
