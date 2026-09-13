import { Injectable } from '@nestjs/common';
import { PopulateJobItemService } from 'src/populate-job-item/populate-job-item.service';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { GameId } from 'utils/types/game-id';
import { progressStatusIdSchema } from 'utils/types/progress-status';
import { PopulateJobRepository } from './populate-job.repository';

@Injectable()
export class PopulateJobService {
  constructor(
    private readonly populateJobRepository: PopulateJobRepository,
    private readonly populateJobItemService: PopulateJobItemService,
  ) {}
  async isAlreadyRunningOrPending(): Promise<boolean> {
    const isRunning = await this.populateJobRepository.existsByStatus(
      progressStatusIdSchema.parse(ProgressStatusEnum.Running.id),
    );
    const isPending = await this.populateJobRepository.existsByStatus(
      progressStatusIdSchema.parse(ProgressStatusEnum.Pending.id),
    );
    return isRunning || isPending;
  }

  async registerGames(gameIds: GameId[]): Promise<void> {
    if (await this.isAlreadyRunningOrPending()) return;

    const job = await this.populateJobRepository.insert(gameIds.length);
    await this.populateJobItemService.registerGames(job.id, gameIds);
  }
}
