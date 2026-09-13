import { gameIdSchema } from 'utils/types/game-id';
import { z } from 'zod';

const gameRecentlyPlayedSchema = z
  .object({
    appid: gameIdSchema,
    name: z.string(),
    playtime_forever: z.number().int().nonnegative(),
    img_icon_url: z.string(),
  })
  .transform((game) => ({
    gameId: game.appid,
    name: game.name,
    playtimeForever: game.playtime_forever,
    imgIconUrl: game.img_icon_url,
  }));

export const gameRecentlyPlayedResponseSchema = z
  .object({
    response: z.object({
      total_count: z.number().int().nonnegative(),
      games: z.array(gameRecentlyPlayedSchema).default([]),
    }),
  })
  .transform(({ response }) => ({
    gameCount: response.total_count,
    games: response.games,
  }));

export type GameRecentlyPlayedDto = z.infer<typeof gameRecentlyPlayedSchema>;
