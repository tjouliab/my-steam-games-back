import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiSteamService } from 'src/api-steam/api-steam.service';
import { GameOwnedDto } from 'src/api-steam/dto/game-owned.dto';
import { GameEntity, gameSchema } from 'src/database/entity/game.entity';
import { PopulateJobService } from 'src/populate-job/populate-job.service';
import { DateUtils } from 'utils/date.utils';
import { gameStatusEnum } from 'utils/enum/game-status.enum';
import { VisibilityEnum } from 'utils/enum/visibility.enum';
import { Env } from 'utils/types/env';
import { PlayerId } from 'utils/types/player-id';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  private readonly playerId: PlayerId;

  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly apiSteamService: ApiSteamService,
    private readonly populateJobService: PopulateJobService,
    private readonly configService: ConfigService<Env>,
  ) {
    this.playerId = this.configService.get('PLAYER_ID', { infer: true });
  }

  async populateTable(): Promise<void> {
    if (await this.populateJobService.isAlreadyRunningOrPending()) return;

    const ownedGames = await this.apiSteamService.getOwnedGames(this.playerId);

    const gameIds = ownedGames.map((g) => g.gameId);
    await this.populateJobService.registerGames(gameIds);
  }

  async saveEnrichedGame(game: GameOwnedDto): Promise<void> {
    const enrichedGame = await this.fetchEnrichedGame(game);
    await this.gamesRepository.upsert(enrichedGame);
  }

  private async fetchEnrichedGame(game: GameOwnedDto): Promise<GameEntity> {
    const { achievements, details, review } =
      await this.apiSteamService.getFullGameInfo(game.gameId);

    const isCompleted = achievements.every((a) => a.achieved);
    const now = DateUtils.now();

    return gameSchema.parse({
      id: game.gameId,
      name: game.name,
      imgIconUrl: game.imgIconUrl,
      metacriticScore: details?.metacriticScore ?? null,
      positiveReviews: review.totalPositive,
      negativeReviews: review.totalNegative,
      playTime: game.playtimeForever,
      lastTimePlayed: game.rtimeLastPlayed?.toString() ?? null,
      releaseDate: details.releaseDate.toString(),
      initialPrice: details.initialPrice,
      personnalScore: null,
      personnalNotes: null,
      visibilityId:
        game.playtimeForever > 0
          ? VisibilityEnum.Visible.id
          : VisibilityEnum.HiddenDefault.id,
      statusId: isCompleted ? gameStatusEnum.Completed.id : null,
      createdAt: now,
      updatedAt: now,
    });
  }
}
