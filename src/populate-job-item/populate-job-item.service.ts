import { Injectable } from '@nestjs/common';
import { PopulateJobItemEntity } from 'src/database/entity/populate-job-item.entity';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { GameId } from 'utils/types/game-id';
import { PopulateJobId } from 'utils/types/populate-job-id';
import { ProgressStatusId } from 'utils/types/progress-status';
import { PopulateJobItemRepository } from './populate-job-item.repository';

@Injectable()
export class PopulateJobItemService {
  constructor(
    private readonly populateJobItemRepository: PopulateJobItemRepository,
  ) {}

  async getPendingOrFailedById(
    id: PopulateJobId,
  ): Promise<PopulateJobItemEntity[]> {
    return this.populateJobItemRepository.getPendingOrFailedById(id);
  }
  async getCompletedOrCanceledById(
    id: PopulateJobId,
  ): Promise<PopulateJobItemEntity[]> {
    return this.populateJobItemRepository.getCompletedOrCanceledById(id);
  }

  async registerGames(jobId: PopulateJobId, gameIds: GameId[]): Promise<void> {
    return this.populateJobItemRepository.insertMany(jobId, gameIds);
  }

  async setRunning(jobItem: PopulateJobItemEntity): Promise<void> {
    await this.populateJobItemRepository.incrementAttempts(
      jobItem.jobId,
      jobItem.gameId,
    );
    return this.setStatus(jobItem, ProgressStatusEnum.Running.id);
  }
  async setCompleted(jobItem: PopulateJobItemEntity): Promise<void> {
    return this.setStatus(jobItem, ProgressStatusEnum.Completed.id);
  }
  async setFailed(jobItem: PopulateJobItemEntity): Promise<void> {
    return this.setStatus(jobItem, ProgressStatusEnum.Failed.id);
  }
  async setCanceled(jobItem: PopulateJobItemEntity): Promise<void> {
    return this.setStatus(jobItem, ProgressStatusEnum.Canceled.id);
  }

  private async setStatus(
    jobItem: PopulateJobItemEntity,
    status: ProgressStatusId,
  ): Promise<void> {
    if (jobItem.progressStatusId === status) return;

    await this.populateJobItemRepository.setStatus(
      jobItem.jobId,
      jobItem.gameId,
      status,
    );
    jobItem.progressStatusId = status;
  }
}
