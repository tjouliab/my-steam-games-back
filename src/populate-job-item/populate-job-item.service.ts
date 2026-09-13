import { Injectable } from '@nestjs/common';
import { GameId } from 'utils/types/game-id';
import { PopulateJobId } from 'utils/types/populate-job-id';
import { PopulateJobItemRepository } from './populate-job-item.repository';

@Injectable()
export class PopulateJobItemService {
  constructor(
    private readonly populateJobItemRepository: PopulateJobItemRepository,
  ) {}

  async registerGames(jobId: PopulateJobId, gameIds: GameId[]): Promise<void> {
    return this.populateJobItemRepository.insertMany(jobId, gameIds);
  }
}
