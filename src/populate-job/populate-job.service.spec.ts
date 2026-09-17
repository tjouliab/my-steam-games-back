import { Test, TestingModule } from '@nestjs/testing';
import { PopulateJobEntity } from 'src/database/entity/populate-job.entity';
import { PopulateJobItemService } from 'src/populate-job-item/populate-job-item.service';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { populateJobIdSchema } from 'utils/types/populate-job-id';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PopulateJobRepository } from './populate-job.repository';
import { PopulateJobService } from './populate-job.service';

describe('PopulateJobService', () => {
  const populateJobRepositoryMock = {
    setStartAt: vi.fn(),
    setStatus: vi.fn(),
  };

  const populateJobItemServiceMock = {
    getPendingOrFailedById: vi.fn(),
    setRunning: vi.fn(),
    setCompleted: vi.fn(),
    setFailed: vi.fn(),
    setCanceled: vi.fn(),
  };

  let service: PopulateJobService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PopulateJobService,
        { provide: PopulateJobRepository, useValue: populateJobRepositoryMock },
        {
          provide: PopulateJobItemService,
          useValue: populateJobItemServiceMock,
        },
      ],
    }).compile();

    service = module.get(PopulateJobService);
  });

  describe('setStatus', () => {
    it('should persist a failure after retrying a failed job', async () => {
      const job: Partial<PopulateJobEntity> = {
        id: populateJobIdSchema.parse('1'),
        progressStatusId: ProgressStatusEnum.Failed.id,
      };

      await service.setRunning(job as PopulateJobEntity);

      expect(job.progressStatusId).toEqual(ProgressStatusEnum.Running.id);

      await service.setFailed(job as PopulateJobEntity);

      expect(job.progressStatusId).toEqual(ProgressStatusEnum.Failed.id);

      expect(populateJobRepositoryMock.setStatus).toHaveBeenNthCalledWith(
        1,
        job.id,
        ProgressStatusEnum.Running.id,
      );
      expect(populateJobRepositoryMock.setStatus).toHaveBeenNthCalledWith(
        2,
        job.id,
        ProgressStatusEnum.Failed.id,
      );
    });
  });
});
