import { Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { PopulateJobItemEntity } from 'src/database/entity/populate-job-item.entity';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { GameId } from 'utils/types/game-id';
import { PopulateJobId } from 'utils/types/populate-job-id';
import { ProgressStatusId } from 'utils/types/progress-status';
import { DatabaseService } from '../database/database.service';
import { populateJobItem } from '../database/schema';

@Injectable()
export class PopulateJobItemRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPendingOrFailedById(
    id: PopulateJobId,
  ): Promise<PopulateJobItemEntity[]> {
    return this.databaseService.db
      .select()
      .from(populateJobItem)
      .where(
        and(
          eq(populateJobItem.jobId, id),
          eq(populateJobItem.progressStatusId, ProgressStatusEnum.Pending.id),
          eq(populateJobItem.progressStatusId, ProgressStatusEnum.Failed.id),
        ),
      );
  }

  async insertMany(jobId: PopulateJobId, gameIds: GameId[]): Promise<void> {
    const jobItems = gameIds.map((gameId) => ({
      jobId,
      gameId,
    }));

    await this.databaseService.db.insert(populateJobItem).values(jobItems);
  }

  async incrementAttempts(jobId: PopulateJobId, gameId: GameId): Promise<void> {
    await this.databaseService.db
      .update(populateJobItem)
      .set({
        attempts: sql`${populateJobItem.attempts} + 1`,
      })
      .where(
        and(
          eq(populateJobItem.jobId, jobId),
          eq(populateJobItem.gameId, gameId),
        ),
      );
  }

  async setStatus(
    jobId: PopulateJobId,
    gameId: GameId,
    status: ProgressStatusId,
  ): Promise<void> {
    await this.databaseService.db
      .update(populateJobItem)
      .set({ progressStatusId: status })
      .where(
        and(
          eq(populateJobItem.jobId, jobId),
          eq(populateJobItem.gameId, gameId),
        ),
      );
  }
}
