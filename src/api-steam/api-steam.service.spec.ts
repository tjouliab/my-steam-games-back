import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Env } from 'utils/types/env';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { gameIdSchema } from '../../utils/types/game-id';
import { playerIdSchema } from '../../utils/types/player-id';
import { ApiSteamService } from './api-steam.service';

describe('ApiSteamService', () => {
  const playerId = playerIdSchema.parse('76561198000000000');
  const gameId = gameIdSchema.parse(730);

  let service: ApiSteamService;

  const httpServiceMock = {
    get: vi.fn(),
  };

  const configServiceMock = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    configServiceMock.get.mockReturnValue('test-api-key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiSteamService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: ConfigService<Env>,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get(ApiSteamService);
  });

  describe('getOwnedGames', () => {
    it('should call Steam API with the correct URL', () => {
      httpServiceMock.get.mockReturnValue(of({ data: {} }));

      service.getOwnedGames(playerId);

      expect(httpServiceMock.get).toHaveBeenCalledOnce();

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
        {
          params: {
            format: 'json',
            include_appinfo: true,
            include_played_free_games: true,
            key: 'test-api-key',
            steamid: '76561198000000000',
          },
        },
      );
    });
  });

  describe('getRecentlyPlayedGames', () => {
    it('should call Steam API with the correct URL', () => {
      httpServiceMock.get.mockReturnValue(of({ data: {} }));

      service.getRecentlyPlayedGames(playerId);

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/',
        {
          params: {
            key: 'test-api-key',
            steamid: '76561198000000000',
          },
        },
      );
    });
  });

  describe('getPlayerAchievements', () => {
    it('should call Steam API with the correct URL', () => {
      httpServiceMock.get.mockReturnValue(of({ data: {} }));

      service.getPlayerAchievements(playerId, gameId);

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
        {
          params: {
            appid: 730,
            key: 'test-api-key',
            steamid: '76561198000000000',
          },
        },
      );
    });
  });

  describe('getGameDetails', () => {
    it('should call Steam Store API with the correct URL', () => {
      httpServiceMock.get.mockReturnValue(of({ data: {} }));

      service.getGameDetails(gameId);

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://store.steampowered.com/api/appdetails',
        {
          params: {
            appIds: 730,
          },
        },
      );
    });
  });

  describe('getGameReview', () => {
    it('should call Steam Store API with the correct URL', () => {
      httpServiceMock.get.mockReturnValue(of({ data: {} }));

      service.getGameReview(gameId);

      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://store.steampowered.com/appreviews/730',
        {
          params: {
            json: true,
            language: 'all',
            num_per_page: 0,
            purchase_type: 'all',
          },
        },
      );
    });
  });
});
