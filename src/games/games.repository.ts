import { Injectable } from '@nestjs/common';
import { GameEntity } from 'src/database/entity/game.entity';
import { DateUtils } from 'utils/date.utils';
import { VisibilityEnum } from 'utils/enum/visibility.enum';
import { DatabaseService } from '../database/database.service';
import { games } from '../database/schema';

@Injectable()
export class GamesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async upsert(newGame: GameEntity): Promise<GameEntity> {
    const now = DateUtils.now();

    const [insertedGame] = await this.databaseService.db
      .insert(games)
      .values({
        ...newGame,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: games.id,
        set: {
          metacriticScore: newGame.metacriticScore,
          positiveReviews: newGame.positiveReviews,
          negativeReviews: newGame.negativeReviews,
          playTime: newGame.playTime,
          lastTimePlayed: newGame.lastTimePlayed,

          // Update visibility only if set manually
          ...(newGame.visibilityId !== VisibilityEnum.HiddenDefault.id && {
            visibilityId: newGame.visibilityId,
          }),

          // Avoid to override a value set manually
          ...(newGame.statusId !== null && {
            statusId: newGame.statusId,
          }),

          updatedAt: now,
        },
      })
      .returning();

    return insertedGame;
  }
}
