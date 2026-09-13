import { apiKeySchema } from 'utils/types/api-key';
import { z } from 'zod';
import { playerIdSchema } from './player-id';

const parseStringList = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  return JSON.parse(value);
}, z.array(playerIdSchema));

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  STEAM_API_KEY: apiKeySchema,

  PLAYER_ID: playerIdSchema,
  FAMILY_PLAYERS_ID: parseStringList,
  DB_FILE_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;
