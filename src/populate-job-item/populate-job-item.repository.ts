import { Injectable } from '@nestjs/common';
import { GameId } from 'utils/types/game-id';
import { PopulateJobId } from 'utils/types/populate-job-id';
import { DatabaseService } from '../database/database.service';
import { populateJobItem } from '../database/schema';

@Injectable()
export class PopulateJobItemRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async insertMany(jobId: PopulateJobId, gameIds: GameId[]): Promise<void> {
    const jobItems = gameIds.map((gameId) => ({
      jobId,
      gameId,
    }));

    await this.databaseService.db.insert(populateJobItem).values(jobItems);
  }
}
