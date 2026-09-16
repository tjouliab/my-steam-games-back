import { z } from 'zod';

const playerAchievementSchema = z
  .object({
    apiname: z.string().nonempty(),
    achieved: z.literal([0, 1]),
    unlocktime: z.number().int().nonnegative(),
  })
  .transform((game) => ({
    achievementName: game.apiname,
    achieved: Boolean(game.achieved),
    unlockTimestamp: game.unlocktime,
  }));

const playerStatsSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    steamID: z.string().regex(/^\d+$/),
    gameName: z.string().nonempty(),
    achievements: z.array(playerAchievementSchema).default([]),
  }),

  z.object({
    success: z.literal(false),
  }),
]);

export const playerAchievementsResponseSchema = z
  .object({
    playerstats: playerStatsSchema,
  })
  .transform(({ playerstats }) => {
    if (!playerstats.success) {
      return {
        success: false as const,
      };
    }

    return {
      success: true as const,
      playerId: playerstats.steamID,
      gameName: playerstats.gameName,
      achievements: playerstats.achievements,
    };
  });

export type PlayerAchievementDto = z.infer<typeof playerAchievementSchema>;
