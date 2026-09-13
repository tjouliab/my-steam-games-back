import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKey } from 'utils/types/api-key';
import { Env } from 'utils/types/env';
import { GameId } from 'utils/types/game-id';
import { PlayerId } from 'utils/types/player-id';
import { GameDetailsReponse } from './dto/game-details.dto';
import { GamesOwnedResponse } from './dto/game-owned.dto';
import { GamesRecentlyPlayedResponse } from './dto/game-recently-played.dto';
import { GameReviewResponse } from './dto/game-reviews.dto';
import { PlayerAchievementsResponse } from './dto/player-achievements.dto';

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

  public getOwnedGames(playerId: PlayerId) {
    return this.httpService.get<GamesOwnedResponse>(
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
  }

  public getRecentlyPlayedGames(playerId: PlayerId) {
    return this.httpService.get<GamesRecentlyPlayedResponse>(
      `${this.apiUrl}/IPlayerService/GetRecentlyPlayedGames/v0001/`,
      { params: { key: this.apiKey, steamid: playerId } },
    );
  }

  public getPlayerAchievements(playerId: PlayerId, gameId: GameId) {
    return this.httpService.get<PlayerAchievementsResponse>(
      `${this.apiUrl}/ISteamUserStats/GetPlayerAchievements/v0001/`,
      { params: { key: this.apiKey, steamid: playerId, appid: gameId } },
    );
  }

  public getGameDetails(gameId: GameId) {
    return this.httpService.get<GameDetailsReponse>(
      `${this.storeUrl}/api/appdetails`,
      { params: { appIds: gameId } },
    );
  }

  public getGameReview(gameId: GameId) {
    return this.httpService.get<GameReviewResponse>(
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
  }
}
