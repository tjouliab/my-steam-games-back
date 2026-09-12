import { gameIdSchema } from 'utils/types/game-id';
import { z } from 'zod';

const gameOwnedSchema = z
  .object({
    appid: gameIdSchema,
    name: z.string(),
    playtime_forever: z.number().int().nonnegative(),
    img_icon_url: z.string(),
    rtime_last_played: z.number().int().nullable().optional(),
  })
  .transform((game) => ({
    gameId: game.appid,
    name: game.name,
    playtimeForever: game.playtime_forever,
    imgIconUrl: game.img_icon_url,
    rtimeLastPlayed: game.rtime_last_played ?? null,
  }));

const gamesOwnedResponseSchema = z
  .object({
    response: z.object({
      game_count: z.number().int().nonnegative(),
      games: z.array(gameOwnedSchema).default([]),
    }),
  })
  .transform(({ response }) => ({
    gameCount: response.game_count,
    games: response.games,
  }));

export type GameOwnedDto = z.infer<typeof gameOwnedSchema>;

export type GamesOwnedResponse = z.infer<typeof gamesOwnedResponseSchema>;
