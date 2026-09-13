import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ApiKey } from 'utils/types/api-key';
import { Env } from 'utils/types/env';
import { GameId } from 'utils/types/game-id';
import { PlayerId } from 'utils/types/player-id';
import { GameDetailsDto, GameDetailsReponse } from './dto/game-details.dto';
import { GameOwnedDto, GamesOwnedResponse } from './dto/game-owned.dto';
import {
  GameRecentlyPlayedDto,
  GamesRecentlyPlayedResponse,
} from './dto/game-recently-played.dto';
import { GameReviewDto, GameReviewResponse } from './dto/game-reviews.dto';
import {
  PlayerAchievementDto,
  PlayerAchievementsResponse,
} from './dto/player-achievements.dto';

@Injectable()
export class ApiSteamService {
  private readonly apiUrl = 'https://api.steampowered.com';
  private readonly storeUrl = 'https://store.steampowered.com';

  private readonly apiKey: ApiKey;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Env>,
  ) {
    this.apiKey = this.configService.get('STEAM_API_KEY', { infer: true });
  }

  async getOwnedGames(playerId: PlayerId): Promise<GameOwnedDto[]> {
    const response = await firstValueFrom(
      this.httpService.get<GamesOwnedResponse>(
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
      ),
    );

    return response.data.games;
  }

  async getRecentlyPlayedGames(
    playerId: PlayerId,
  ): Promise<GameRecentlyPlayedDto[]> {
    const response = await firstValueFrom(
      this.httpService.get<GamesRecentlyPlayedResponse>(
        `${this.apiUrl}/IPlayerService/GetRecentlyPlayedGames/v0001/`,
        { params: { key: this.apiKey, steamid: playerId } },
      ),
    );

    return response.data.games;
  }

  async getPlayerAchievements(
    playerId: PlayerId,
    gameId: GameId,
  ): Promise<PlayerAchievementDto[]> {
    const response = await firstValueFrom(
      this.httpService.get<PlayerAchievementsResponse>(
        `${this.apiUrl}/ISteamUserStats/GetPlayerAchievements/v0001/`,
        { params: { key: this.apiKey, steamid: playerId, appid: gameId } },
      ),
    );

    return response.data.achievements;
  }

  async getGameDetails(gameId: GameId): Promise<GameDetailsDto> {
    const response = await firstValueFrom(
      this.httpService.get<GameDetailsReponse>(
        `${this.storeUrl}/api/appdetails`,
        { params: { appIds: gameId } },
      ),
    );

    return response.data[gameId].data;
  }

  async getGameReview(gameId: GameId): Promise<GameReviewDto> {
    const response = await firstValueFrom(
      this.httpService.get<GameReviewResponse>(
        `${this.storeUrl}/appreviews/${gameId}`,
        {
          params: {
            language: 'all',
            purchase_type: 'all',
            json: true,
            num_per_page: 0,
          },
        },
      ),
    );

    return response.data.gameReview;
  }
}
