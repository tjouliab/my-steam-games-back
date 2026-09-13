import { z } from 'zod';

const playerAchievementSchema = z
  .object({
    apiname: z.string().nonempty(),
    achieved: z.boolean(),
    unlocktime: z.number().int().nonnegative(),
  })
  .transform((game) => ({
    achievementName: game.apiname,
    achieved: game.achieved,
    unlockTimestamp: game.unlocktime,
  }));

export const playerAchievementsResponseSchema = z
  .object({
    playerstats: z.object({
      steamID: z.number().int().nonnegative(),
      gameName: z.string().nonempty(),
      achievements: z.array(playerAchievementSchema).default([]),
    }),
  })
  .transform(({ playerstats }) => ({
    playerId: playerstats.steamID,
    gameName: playerstats.gameName,
    achievements: playerstats.achievements,
  }));

export type PlayerAchievementDto = z.infer<typeof playerAchievementSchema>;
