import { apiKeySchema } from 'utils/types/api-key';
import { z } from 'zod';
import { playerIdSchema } from './player-id';

const parseStringUInt = z.preprocess((value) => {
  if (typeof value === 'number') return value;
  return Number(value);
}, z.int().positive());

const parseStringList = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  return JSON.parse(value);
}, z.array(z.string()));

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  STEAM_API_KEY: apiKeySchema,

  PLAYER_ID: playerIdSchema,
  FAMILY_PLAYERS_ID: parseStringList.pipe(z.array(playerIdSchema)),
  DB_FILE_NAME: z.string(),
  MAX_JOB_ITEM_ATTEMPTS: parseStringUInt.default(10),
});

export type Env = z.infer<typeof envSchema>;
