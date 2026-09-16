import { Injectable } from '@nestjs/common';
import { eq, or, sql } from 'drizzle-orm';
import { DateUtils } from 'utils/date.utils';
import { ProgressStatusEnum } from 'utils/enum/progress-status.enum';
import { PopulateJobId } from 'utils/types/populate-job-id';
import { ProgressStatusId } from 'utils/types/progress-status';
import { DatabaseService } from '../database/database.service';
import { PopulateJobEntity } from '../database/entity/populate-job.entity';
import { populateJob } from '../database/schema';

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

  async incrementCompletedGames(jobId: PopulateJobId): Promise<void> {
    await this.databaseService.db
      .update(populateJob)
      .set({
        completedGames: sql`${populateJob.completedGames} + 1`,
      })
      .where(eq(populateJob.id, jobId));
  }

  async setStartAt(
    jobId: PopulateJobId,
    startAt: Temporal.Instant,
  ): Promise<void> {
    await this.databaseService.db
      .update(populateJob)
      .set({
        startAt: startAt.toString(),
        updatedAt: DateUtils.now(),
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
        finishedAt: finishedAt.toString(),
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
}
