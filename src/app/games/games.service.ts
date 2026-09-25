import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiSteamService } from 'src/app/api-steam/api-steam.service';
import { GameOwnedDto } from 'src/app/api-steam/dto/game-owned.dto';
import { GameEntity, gameSchema } from 'src/database/entity/game.entity';
import { DateUtils } from 'src/utils/date.utils';
import { gameStatusEnum } from 'src/utils/enum/game-status.enum';
import { VisibilityEnum } from 'src/utils/enum/visibility.enum';
import { Env } from 'src/utils/types/env';
import { PlayerId } from 'src/utils/types/player-id';
import { PopulateJobService } from '../populate-job/populate-job.service';
import { GamesResponse } from './contracts/games.contract';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  private readonly playerId: PlayerId;

  constructor(
    private readonly gamesRepository: GamesRepository,
    private readonly apiSteamService: ApiSteamService,
    private readonly populateJobService: PopulateJobService,
    private readonly configService: ConfigService<Env, true>,
  ) {
    this.playerId = this.configService.get('PLAYER_ID', { infer: true });
  }
  async get(): Promise<GamesResponse> {
    return this.gamesRepository.get();
  }

  async populateTable(): Promise<void> {
    if (await this.populateJobService.isAlreadyRunningOrPending()) return;

    const ownedGames = await this.apiSteamService.getOwnedGames(this.playerId);

    const gameIds = ownedGames.map((g) => g.gameId);
    await this.populateJobService.registerGames(gameIds);
  }

  async saveEnrichedGame(game: GameOwnedDto): Promise<void> {
    const enrichedGame = await this.fetchEnrichedGame(game);
    this.gamesRepository.save(enrichedGame);
  }

  private async fetchEnrichedGame(game: GameOwnedDto): Promise<GameEntity> {
    const { achievements, details, review } =
      await this.apiSteamService.getFullGameInfo(game.gameId);

    const isCompleted = achievements.every((a) => a.achieved);
    const now = DateUtils.now();

    const gameEntity = gameSchema.parse({
      id: game.gameId,
      name: game.name,
      imgIconUrl: details.imgIconUrl,
      metacriticScore: details?.metacriticScore ?? null,
      positiveReviews: review.totalPositive,
      negativeReviews: review.totalNegative,
      playTime: game.playtimeForever,
      lastTimePlayed: game.rtimeLastPlayed ?? null,
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
      genres: details.genres,
    });

    return gameEntity;
  }
}
