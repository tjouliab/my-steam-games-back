import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiSteamService } from 'src/api-steam/api-steam.service';
import { GameDetailsDto } from 'src/api-steam/dto/game-details.dto';
import { GameOwnedDto } from 'src/api-steam/dto/game-owned.dto';
import { GameReviewDto } from 'src/api-steam/dto/game-reviews.dto';
import { PlayerAchievementDto } from 'src/api-steam/dto/player-achievements.dto';
import { PopulateJobService } from 'src/populate-job/populate-job.service';
import { gameStatusEnum } from 'utils/enum/game-status.enum';
import { VisibilityEnum } from 'utils/enum/visibility.enum';
import { gameDetailsFixture } from 'utils/fixture/game-details-fixture';
import { gameOwnedFixture } from 'utils/fixture/game-owned-fixture';
import { gameReviewFixture } from 'utils/fixture/game-review-fixture';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';

describe('GamesService', () => {
  const game: GameOwnedDto = { ...gameOwnedFixture };
  const details: GameDetailsDto = { ...gameDetailsFixture };
  const review: GameReviewDto = { ...gameReviewFixture };

  const gamesRepositoryMock = { upsert: vi.fn() };
  const apiSteamServiceMock = {
    getOwnedGames: vi.fn(),
    getFullGameInfo: vi.fn(),
  };
  const populateJobServiceMock = {
    isAlreadyRunningOrPending: vi.fn(),
    registerGames: vi.fn(),
  };
  const configServiceMock = {
    get: vi.fn().mockReturnValue('76561198000000000'),
  };

  let service: GamesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        { provide: GamesRepository, useValue: gamesRepositoryMock },
        { provide: ApiSteamService, useValue: apiSteamServiceMock },
        { provide: PopulateJobService, useValue: populateJobServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get(GamesService);
  });

  it('should not register games while a population job is already active', async () => {
    populateJobServiceMock.isAlreadyRunningOrPending.mockResolvedValue(true);

    await service.populateTable();

    expect(apiSteamServiceMock.getOwnedGames).not.toHaveBeenCalled();
    expect(populateJobServiceMock.registerGames).not.toHaveBeenCalled();
  });

  it('should register owned game ids when no population job is active', async () => {
    populateJobServiceMock.isAlreadyRunningOrPending.mockResolvedValue(false);
    apiSteamServiceMock.getOwnedGames.mockResolvedValue([
      game,
      { ...game, gameId: 440 },
    ]);

    await service.populateTable();

    expect(apiSteamServiceMock.getOwnedGames).toHaveBeenCalledWith(
      '76561198000000000',
    );
    expect(populateJobServiceMock.registerGames).toHaveBeenCalledWith([
      730, 440,
    ]);
  });

  it('should save an enriched completed game with the expected projection', async () => {
    const achievements: PlayerAchievementDto[] = [
      { achievementName: 'first', achieved: true, unlockTimestamp: 1 },
    ];
    apiSteamServiceMock.getFullGameInfo.mockResolvedValue({
      achievements,
      details,
      review,
    });

    await service.saveEnrichedGame(game);

    expect(gamesRepositoryMock.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: game.gameId,
        name: game.name,
        imgIconUrl: game.imgIconUrl,
        metacriticScore: details.metacriticScore,
        positiveReviews: review.totalPositive,
        negativeReviews: review.totalNegative,
        playTime: game.playtimeForever,
        lastTimePlayed: game.rtimeLastPlayed?.toString(),
        releaseDate: details.releaseDate.toString(),
        initialPrice: details.initialPrice,
        visibilityId: VisibilityEnum.Visible.id,
        statusId: gameStatusEnum.Completed.id,
      }),
    );
  });

  it('should use defaults for an unplayed unfinished game', async () => {
    apiSteamServiceMock.getFullGameInfo.mockResolvedValue({
      achievements: [
        { achievementName: 'first', achieved: false, unlockTimestamp: 0 },
      ],
      details: { ...details, metacriticScore: undefined },
      review,
    });
    const unplayedGame = { ...game, playtimeForever: 0, rtimeLastPlayed: null };

    await service.saveEnrichedGame(unplayedGame);

    expect(gamesRepositoryMock.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        metacriticScore: null,
        lastTimePlayed: null,
        visibilityId: VisibilityEnum.HiddenDefault.id,
        statusId: null,
      }),
    );
  });
});
