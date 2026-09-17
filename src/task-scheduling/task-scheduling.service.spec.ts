import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiSteamService } from 'src/api-steam/api-steam.service';
import { GameOwnedDto } from 'src/api-steam/dto/game-owned.dto';
import { PopulateJobItemEntity } from 'src/database/entity/populate-job-item.entity';
import { PopulateJobEntity } from 'src/database/entity/populate-job.entity';
import { GamesService } from 'src/games/games.service';
import { PopulateJobItemService } from 'src/populate-job-item/populate-job-item.service';
import { PopulateJobService } from 'src/populate-job/populate-job.service';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { gameOwnedFixture } from 'utils/fixture/game-owned-fixture';
import { populateJobFixture } from 'utils/fixture/populate-job-fixture';
import { Env } from 'utils/types/env';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskSchedulingService } from './task-scheduling.service';

describe('TaskSchedulingService', () => {
  const game: GameOwnedDto = { ...gameOwnedFixture };
  const job: PopulateJobEntity = { ...populateJobFixture };

  const createJobItem = (
    overrides: Partial<PopulateJobItemEntity> = {},
  ): PopulateJobItemEntity => ({
    jobId: job.id,
    gameId: game.gameId,
    progressStatusId: ProgressStatusEnum.Pending.id,
    attempts: 0,
    ...overrides,
  });

  const apiSteamServiceMock = {
    getFamilyOwnedGamesMap: vi.fn(),
  };
  const gamesServiceMock = {
    saveEnrichedGame: vi.fn(),
  };
  const populateJobServiceMock = {
    getPendingOrFailed: vi.fn(),
    incrementCompletedGames: vi.fn(),
    setRunning: vi.fn(),
    setCompleted: vi.fn(),
    setFailed: vi.fn(),
  };
  const populateJobItemServiceMock = {
    getPendingOrFailedById: vi.fn(),
    setRunning: vi.fn(),
    setCompleted: vi.fn(),
    setFailed: vi.fn(),
    setCanceled: vi.fn(),
  };
  const configServiceMock = {
    get: vi.fn().mockReturnValue(3),
  };

  let service: TaskSchedulingService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskSchedulingService,
        { provide: ApiSteamService, useValue: apiSteamServiceMock },
        { provide: GamesService, useValue: gamesServiceMock },
        { provide: PopulateJobService, useValue: populateJobServiceMock },
        {
          provide: PopulateJobItemService,
          useValue: populateJobItemServiceMock,
        },
        { provide: ConfigService<Env>, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get(TaskSchedulingService);
  });

  it('should do nothing when there is no pending or failed job', async () => {
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(null);

    await service.handleCron();

    expect(
      populateJobItemServiceMock.getPendingOrFailedById,
    ).not.toHaveBeenCalled();
    expect(apiSteamServiceMock.getFamilyOwnedGamesMap).not.toHaveBeenCalled();
  });

  it('should complete a job when its item is canceled because the game is no longer owned', async () => {
    const item = createJobItem();
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(job);
    populateJobItemServiceMock.getPendingOrFailedById.mockResolvedValue([item]);
    apiSteamServiceMock.getFamilyOwnedGamesMap.mockResolvedValue(new Map());

    await service.handleCron();

    expect(populateJobItemServiceMock.setCanceled).toHaveBeenCalledWith(item);
    expect(gamesServiceMock.saveEnrichedGame).not.toHaveBeenCalled();
    expect(populateJobServiceMock.setCompleted).toHaveBeenCalledWith(job);
    expect(populateJobServiceMock.setFailed).not.toHaveBeenCalled();
  });

  it('should keep a job failed when an item fails below the attempt limit', async () => {
    const item = createJobItem({ attempts: 1 });
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(job);
    populateJobItemServiceMock.getPendingOrFailedById.mockResolvedValue([item]);
    apiSteamServiceMock.getFamilyOwnedGamesMap.mockResolvedValue(
      new Map([[game.gameId, game]]),
    );
    gamesServiceMock.saveEnrichedGame.mockRejectedValue(
      new Error('rate limited'),
    );

    await service.handleCron();

    expect(populateJobItemServiceMock.setFailed).toHaveBeenCalledWith(item);
    expect(populateJobItemServiceMock.setCanceled).not.toHaveBeenCalled();
    expect(populateJobServiceMock.setFailed).toHaveBeenCalledWith(job);
    expect(populateJobServiceMock.setCompleted).not.toHaveBeenCalled();
  });

  it('should cancel an item after too many attempts so the job can complete', async () => {
    const item = createJobItem({ attempts: 3 });
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(job);
    populateJobItemServiceMock.getPendingOrFailedById.mockResolvedValue([item]);
    apiSteamServiceMock.getFamilyOwnedGamesMap.mockResolvedValue(
      new Map([[game.gameId, game]]),
    );
    gamesServiceMock.saveEnrichedGame.mockRejectedValue(
      new Error('rate limited'),
    );

    await service.handleCron();

    expect(populateJobItemServiceMock.setCanceled).toHaveBeenCalledWith(item);
    expect(populateJobServiceMock.setCompleted).toHaveBeenCalledWith(job);
    expect(populateJobServiceMock.setFailed).not.toHaveBeenCalled();
  });

  it('should cancel an item when Steam rejects its achievements request', async () => {
    const item = createJobItem();
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(job);
    populateJobItemServiceMock.getPendingOrFailedById.mockResolvedValue([item]);
    apiSteamServiceMock.getFamilyOwnedGamesMap.mockResolvedValue(
      new Map([[game.gameId, game]]),
    );
    gamesServiceMock.saveEnrichedGame.mockRejectedValue({
      isAxiosError: true,
      response: { status: 400 },
    });

    await service.handleCron();

    expect(populateJobItemServiceMock.setCanceled).toHaveBeenCalledWith(item);
    expect(populateJobItemServiceMock.setFailed).not.toHaveBeenCalled();
    expect(populateJobServiceMock.setCompleted).toHaveBeenCalledWith(job);
    expect(populateJobServiceMock.setFailed).not.toHaveBeenCalledWith(job);
  });

  it('should fail the job when Steam rate limits an item below the attempt limit', async () => {
    const item = createJobItem({ attempts: 1 });
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(job);
    populateJobItemServiceMock.getPendingOrFailedById.mockResolvedValue([item]);
    apiSteamServiceMock.getFamilyOwnedGamesMap.mockResolvedValue(
      new Map([[game.gameId, game]]),
    );
    gamesServiceMock.saveEnrichedGame.mockRejectedValue({
      isAxiosError: true,
      response: { status: 429 },
    });

    await service.handleCron();

    expect(populateJobItemServiceMock.setFailed).toHaveBeenCalledWith(item);
    expect(populateJobServiceMock.setFailed).toHaveBeenCalledWith(job);
    expect(populateJobServiceMock.setCompleted).not.toHaveBeenCalled();
  });

  it('should fail a previously failed job again after a rate limit', async () => {
    const failedJob = {
      ...job,
      progressStatusId: ProgressStatusEnum.Failed.id,
    };
    const item = createJobItem({
      progressStatusId: ProgressStatusEnum.Failed.id,
      attempts: 1,
    });
    populateJobServiceMock.getPendingOrFailed.mockResolvedValue(failedJob);
    populateJobItemServiceMock.getPendingOrFailedById.mockResolvedValue([item]);
    apiSteamServiceMock.getFamilyOwnedGamesMap.mockResolvedValue(
      new Map([[game.gameId, game]]),
    );
    gamesServiceMock.saveEnrichedGame.mockRejectedValue({
      isAxiosError: true,
      response: { status: 429 },
    });

    await service.handleCron();

    expect(populateJobItemServiceMock.setRunning).toHaveBeenCalledWith(item);
    expect(populateJobItemServiceMock.setFailed).toHaveBeenCalledWith(item);
    expect(populateJobServiceMock.setRunning).toHaveBeenCalledWith(failedJob);
    expect(populateJobServiceMock.setFailed).toHaveBeenCalledWith(failedJob);
    expect(populateJobServiceMock.setCompleted).not.toHaveBeenCalled();
  });
});
