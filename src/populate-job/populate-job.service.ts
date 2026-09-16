import { Injectable } from '@nestjs/common';
import { PopulateJobEntity } from 'src/database/entity/populate-job.entity';
import { PopulateJobItemService } from 'src/populate-job-item/populate-job-item.service';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { GameId } from 'utils/types/game-id';
import { PopulateJobId } from 'utils/types/populate-job-id';
import { ProgressStatusId } from 'utils/types/progress-status';
import { PopulateJobRepository } from './populate-job.repository';

@Injectable()
export class PopulateJobService {
  constructor(
    private readonly populateJobRepository: PopulateJobRepository,
    private readonly populateJobItemService: PopulateJobItemService,
  ) {}
  async getPendingOrFailed(): Promise<PopulateJobEntity | null> {
    return this.populateJobRepository.getPendingOrFailed();
  }

  async isAlreadyRunningOrPending(): Promise<boolean> {
    const isRunning = await this.populateJobRepository.existsByStatus(
      ProgressStatusEnum.Running.id,
    );
    const isPending = await this.populateJobRepository.existsByStatus(
      ProgressStatusEnum.Pending.id,
    );
    return isRunning || isPending;
  }

  async registerGames(gameIds: GameId[]): Promise<void> {
    if (await this.isAlreadyRunningOrPending()) return;

    const job = await this.populateJobRepository.insert(gameIds.length);
    await this.populateJobItemService.registerGames(job.id, gameIds);
  }

  async updateCompletedGames(id: PopulateJobId): Promise<void> {
    const completed =
      await this.populateJobItemService.getCompletedOrCanceledById(id);

    return this.populateJobRepository.setCompletedGames(id, completed.length);
  }

  async setRunning(job: PopulateJobEntity): Promise<void> {
    await this.populateJobRepository.setStartAt(job.id, Temporal.Now.instant());
    return this.setStatus(job, ProgressStatusEnum.Running.id);
  }
  async setCompleted(job: PopulateJobEntity): Promise<void> {
    await this.populateJobRepository.setFinishedAt(
      job.id,
      Temporal.Now.instant(),
    );
    return this.setStatus(job, ProgressStatusEnum.Completed.id);
  }
  async setFailed(job: PopulateJobEntity): Promise<void> {
    return this.setStatus(job, ProgressStatusEnum.Failed.id);
  }
  async setCanceled(job: PopulateJobEntity): Promise<void> {
    await this.populateJobRepository.setFinishedAt(
      job.id,
      Temporal.Now.instant(),
    );
    return this.setStatus(job, ProgressStatusEnum.Canceled.id);
  }

  private async setStatus(
    job: PopulateJobEntity,
    status: ProgressStatusId,
  ): Promise<void> {
    if (job.progressStatusId === status) return;

    return this.populateJobRepository.setStatus(job.id, status);
  }
}
