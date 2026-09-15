import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
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
    axiosRef: {
      get: vi.fn(),
    },
  };
  const configServiceMock = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    configServiceMock.get.mockImplementation((key) => {
      if (key === 'STEAM_API_KEY') return 'test-api-key';
      if (key === 'PLAYER_ID') return playerId;
      if (key === 'FAMILY_PLAYERS_ID') return [];
    });

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
    it('should call Steam API with the correct URL', async () => {
      httpServiceMock.axiosRef.get.mockResolvedValue({
        data: { response: { game_count: 0, games: [] } },
      });

      await service.getOwnedGames(playerId);

      expect(httpServiceMock.axiosRef.get).toHaveBeenCalledOnce();

      expect(httpServiceMock.axiosRef.get).toHaveBeenCalledWith(
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
    it('should call Steam API with the correct URL', async () => {
      httpServiceMock.axiosRef.get.mockResolvedValue({
        data: { response: { total_count: 0, games: [] } },
      });

      await service.getRecentlyPlayedGames();

      expect(httpServiceMock.axiosRef.get).toHaveBeenCalledWith(
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

  describe('getFullGameInfo', () => {
    it('sould call Steam API with the correct URL', async () => {
      httpServiceMock.axiosRef.get
        .mockResolvedValueOnce({
          data: {
            playerstats: {
              steamID: 1,
              gameName: 'Test game',
              achievements: [],
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            [gameId]: {
              success: true,
              data: {
                release_date: { date: new Date() },
                genres: [],
                price_overview: { initial: 0 },
              },
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            success: true,
            query_summary: {
              num_reviews: 0,
              review_score: 0,
              review_score_desc: '',
              total_positive: 0,
              total_negative: 0,
              total_reviews: 0,
            },
          },
        });

      await service.getFullGameInfo(gameId);

      expect(httpServiceMock.axiosRef.get).toHaveBeenCalledWith(
        'https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
        {
          params: {
            appid: 730,
            key: 'test-api-key',
            steamid: '76561198000000000',
          },
        },
      );

      expect(httpServiceMock.axiosRef.get).toHaveBeenCalledWith(
        'https://store.steampowered.com/api/appdetails',
        {
          params: {
            appIds: 730,
          },
        },
      );

      expect(httpServiceMock.axiosRef.get).toHaveBeenCalledWith(
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
