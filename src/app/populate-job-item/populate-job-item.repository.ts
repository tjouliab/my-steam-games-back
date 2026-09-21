import { Injectable } from '@nestjs/common';
import { and, eq, or, sql } from 'drizzle-orm';
import { DatabaseService } from 'src/database/database.service';
import { PopulateJobItemEntity } from 'src/database/entity/populate-job-item.entity';
import { populateJobItem } from 'src/database/schema';
import { ProgressStatusEnum } from 'src/utils/enum/progress-status.enum';
import { GameId } from 'src/utils/types/game-id';
import { PopulateJobId } from 'src/utils/types/populate-job-id';
import { ProgressStatusId } from 'src/utils/types/progress-status';

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
          or(
            eq(populateJobItem.progressStatusId, ProgressStatusEnum.Pending.id),
            eq(populateJobItem.progressStatusId, ProgressStatusEnum.Failed.id),
          ),
        ),
      );
  }

  async getCompletedOrCanceledById(
    id: PopulateJobId,
  ): Promise<PopulateJobItemEntity[]> {
    return this.databaseService.db
      .select()
      .from(populateJobItem)
      .where(
        and(
          eq(populateJobItem.jobId, id),
          or(
            eq(
              populateJobItem.progressStatusId,
              ProgressStatusEnum.Completed.id,
            ),
            eq(
              populateJobItem.progressStatusId,
              ProgressStatusEnum.Canceled.id,
            ),
          ),
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
