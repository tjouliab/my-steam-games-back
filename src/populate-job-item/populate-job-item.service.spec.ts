import { Test, TestingModule } from '@nestjs/testing';
import { PopulateJobItemEntity } from 'src/database/entity/populate-job-item.entity';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { gameIdSchema } from 'utils/types/game-id';
import { populateJobIdSchema } from 'utils/types/populate-job-id';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PopulateJobItemRepository } from './populate-job-item.repository';
import { PopulateJobItemService } from './populate-job-item.service';

describe('PopulateJobItemService', () => {
  const populateJobItemRepository = {
    incrementAttempts: vi.fn(),
    setStatus: vi.fn(),
  };

  let service: PopulateJobItemService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopulateJobItemService,
        {
          provide: PopulateJobItemRepository,
          useValue: populateJobItemRepository,
        },
      ],
    }).compile();

    service = module.get(PopulateJobItemService);
  });

  describe('setStatus', () => {
    it('should persist a failure after retrying a failed item', async () => {
      const item: Partial<PopulateJobItemEntity> = {
        jobId: populateJobIdSchema.parse('1'),
        gameId: gameIdSchema.parse(1),
        progressStatusId: ProgressStatusEnum.Failed.id,
      };

      await service.setRunning(item as PopulateJobItemEntity);

      expect(item.progressStatusId).toEqual(ProgressStatusEnum.Running.id);

      await service.setFailed(item as PopulateJobItemEntity);

      expect(item.progressStatusId).toEqual(ProgressStatusEnum.Failed.id);

      expect(populateJobItemRepository.setStatus).toHaveBeenNthCalledWith(
        1,
        item.jobId,
        item.gameId,
        ProgressStatusEnum.Running.id,
      );
      expect(populateJobItemRepository.setStatus).toHaveBeenNthCalledWith(
        2,
        item.jobId,
        item.gameId,
        ProgressStatusEnum.Failed.id,
      );
    });
  });
});
