import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { GameEntity } from 'src/database/entity/game.entity';
import { GenreEntity } from 'src/database/entity/genre.entity';
import { DateUtils } from 'utils/date.utils';
import { VisibilityEnum } from 'utils/enum/visibility.enum';
import { DatabaseExecutor } from 'utils/types/database-executor';
import { GameId } from 'utils/types/game-id';
import { GenreId } from 'utils/types/genre-id';
import { DatabaseService } from '../database/database.service';
import { gameToGenre, games, genres } from '../database/schema';

type GameRecord = Omit<GameEntity, 'genres'>;

@Injectable()
export class GamesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  save(game: GameEntity): GameEntity {
    const { genres: gameGenres, ...gameRecord } = game;

    return this.databaseService.db.transaction((tx) => {
      const savedGame = this.upsertGame(gameRecord, tx);

      this.upsertGenres(gameGenres, tx);
      this.replaceGenres(
        savedGame.id,
        gameGenres.map((genre) => genre.id),
        tx,
      );

      return { ...savedGame, genres: gameGenres };
    });
  }

  private upsertGame(newGame: GameRecord, db: DatabaseExecutor): GameRecord {
    const now = DateUtils.now();

    const insertedGame = db
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
      .returning()
      .get();

    return insertedGame;
  }

  private upsertGenres(gameGenres: GenreEntity[], db: DatabaseExecutor): void {
    if (gameGenres.length === 0) return;

    db.insert(genres)
      .values(gameGenres)
      .onConflictDoUpdate({
        target: genres.id,
        set: {
          // "excluded" represents the line we are trying to insert
          description: sql`excluded.description`,
        },
      })
      .run();
  }

  private replaceGenres(
    gameId: GameId,
    genreIds: GenreId[],
    db: DatabaseExecutor,
  ): void {
    db.delete(gameToGenre).where(eq(gameToGenre.gameId, gameId)).run();

    if (genreIds.length === 0) return;

    db.insert(gameToGenre)
      .values(genreIds.map((genreId) => ({ gameId, genreId })))
      .run();
  }
}
