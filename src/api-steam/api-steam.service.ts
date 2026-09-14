import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKey } from 'utils/types/api-key';
import { Env } from 'utils/types/env';
import { GameId } from 'utils/types/game-id';
import { PlayerId } from 'utils/types/player-id';
import {
  GameDetailsDto,
  gameDetailsReponseSchema,
} from './dto/game-details.dto';
import { GameOwnedDto, gamesOwnedResponseSchema } from './dto/game-owned.dto';
import {
  GameRecentlyPlayedDto,
  gameRecentlyPlayedResponseSchema,
} from './dto/game-recently-played.dto';
import { GameReviewDto, gameReviewsSchema } from './dto/game-reviews.dto';
import {
  PlayerAchievementDto,
  playerAchievementsResponseSchema,
} from './dto/player-achievements.dto';

@Injectable()
export class ApiSteamService {
  private readonly apiUrl = 'https://api.steampowered.com';
  private readonly storeUrl = 'https://store.steampowered.com';

  private readonly apiKey: ApiKey;
  private readonly playerId: PlayerId;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Env>,
  ) {
    this.apiKey = this.configService.get('STEAM_API_KEY', { infer: true });
    this.playerId = this.configService.get('PLAYER_ID', { infer: true });
  }

  async getOwnedGames(playerId: PlayerId): Promise<GameOwnedDto[]> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.apiUrl}/IPlayerService/GetOwnedGames/v0001/`,
      {
        params: {
          key: this.apiKey,
          steamid: playerId,
          format: 'json',
          include_appinfo: true,
          include_played_free_games: true,
        },
      },
    );

    return gamesOwnedResponseSchema.parse(data).games;
  }

  async getRecentlyPlayedGames(): Promise<GameRecentlyPlayedDto[]> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.apiUrl}/IPlayerService/GetRecentlyPlayedGames/v0001/`,
      { params: { key: this.apiKey, steamid: this.playerId } },
    );

    return gameRecentlyPlayedResponseSchema.parse(data).games;
  }

  async getFullGameInfo(gameId: GameId) {
    const [achievements, details, review] = await Promise.all([
      this.getPlayerAchievements(this.playerId, gameId),
      this.getGameDetails(gameId),
      this.getGameReview(gameId),
    ]);

    return { achievements, details, review };
  }

  private async getPlayerAchievements(
    playerId: PlayerId,
    gameId: GameId,
  ): Promise<PlayerAchievementDto[]> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.apiUrl}/ISteamUserStats/GetPlayerAchievements/v0001/`,
      { params: { key: this.apiKey, steamid: playerId, appid: gameId } },
    );

    return playerAchievementsResponseSchema.parse(data).achievements;
  }

  private async getGameDetails(gameId: GameId): Promise<GameDetailsDto> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.storeUrl}/api/appdetails`,
      { params: { appIds: gameId } },
    );

    return gameDetailsReponseSchema.parse(data)[gameId].data;
  }

  private async getGameReview(gameId: GameId): Promise<GameReviewDto> {
    const { data } = await this.httpService.axiosRef.get(
      `${this.storeUrl}/appreviews/${gameId}`,
      {
        params: {
          language: 'all',
          purchase_type: 'all',
          json: true,
          num_per_page: 0,
        },
      },
    );

    return gameReviewsSchema.parse(data).gameReview;
  }
}
