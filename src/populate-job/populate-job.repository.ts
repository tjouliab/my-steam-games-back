import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ProgressStatusId } from 'utils/types/progress-status';
import { DatabaseService } from '../database/database.service';
import { PopulateJobEntity } from '../database/entity/populate-job.entity';
import { populateJob } from '../database/schema';

@Injectable()
export class PopulateJobRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async existsByStatus(progressStatusId: ProgressStatusId): Promise<boolean> {
    const existing = await this.databaseService.db
      .select({ id: populateJob.id })
      .from(populateJob)
      .where(eq(populateJob.progressStatusId, progressStatusId))
      .limit(1);

    return existing.length > 0;
  }

  async insert(totalGames: number): Promise<PopulateJobEntity> {
    const [job] = await this.databaseService.db
      .insert(populateJob)
      .values({
        totalGames,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return job;
  }
}
