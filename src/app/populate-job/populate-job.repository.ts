import { Injectable } from '@nestjs/common';
import { eq, or, sql } from 'drizzle-orm';
import { DatabaseService } from 'src/database/database.service';
import { PopulateJobEntity } from 'src/database/entity/populate-job.entity';
import { populateJob } from 'src/database/schema';
import { DateUtils } from 'src/utils/date.utils';
import { ProgressStatusEnum } from 'src/utils/enum/progress-status.enum';
import { PopulateJobId } from 'src/utils/types/populate-job-id';
import { ProgressStatusId } from 'src/utils/types/progress-status';

@Injectable()
export class PopulateJobRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPendingOrFailed(): Promise<PopulateJobEntity | null> {
    const [pendingJob] = await this.databaseService.db
      .select()
      .from(populateJob)
      .where(
        or(
          eq(populateJob.progressStatusId, ProgressStatusEnum.Pending.id),
          eq(populateJob.progressStatusId, ProgressStatusEnum.Failed.id),
        ),
      )
      .limit(1);

    return pendingJob ?? null;
  }

  async existsByStatus(progressStatusId: ProgressStatusId): Promise<boolean> {
    const existing = await this.databaseService.db
      .select({ id: populateJob.id })
      .from(populateJob)
      .where(eq(populateJob.progressStatusId, progressStatusId))
      .limit(1);

    return existing.length > 0;
  }

  async insert(totalGames: number): Promise<PopulateJobEntity> {
    const now = DateUtils.now();
    const [job] = await this.databaseService.db
      .insert(populateJob)
      .values({
        totalGames,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return job;
  }

  async updateCompletedGames(jobId: PopulateJobId): Promise<void> {
    await this.databaseService.db
      .update(populateJob)
      .set({
        completedGames: sql`${populateJob.completedGames} + 1`,
      })
      .where(eq(populateJob.id, jobId));
  }

  async setFinishedAt(
    jobId: PopulateJobId,
    finishedAt: Temporal.Instant,
  ): Promise<void> {
    await this.databaseService.db
      .update(populateJob)
      .set({
        finishedAt: finishedAt.toString({ smallestUnit: 'second' }),
        updatedAt: DateUtils.now(),
      })
      .where(eq(populateJob.id, jobId));
  }

  async setStatus(
    jobId: PopulateJobId,
    status: ProgressStatusId,
  ): Promise<void> {
    await this.databaseService.db
      .update(populateJob)
      .set({ progressStatusId: status, updatedAt: DateUtils.now() })
      .where(eq(populateJob.id, jobId));
  }

  async setCompletedGames(
    jobId: PopulateJobId,
    completedGames: number,
  ): Promise<void> {
    await this.databaseService.db
      .update(populateJob)
      .set({ completedGames, updatedAt: DateUtils.now() })
      .where(eq(populateJob.id, jobId));
  }
}
