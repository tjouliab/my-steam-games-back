import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ApiSteamService } from 'src/api-steam/api-steam.service';
import { GameFamilyOwnedMap } from 'src/api-steam/dto/game-family-owned-map';
import { PopulateJobItemEntity } from 'src/database/entity/populate-job-item.entity';
import { GamesService } from 'src/games/games.service';
import { PopulateJobItemService } from 'src/populate-job-item/populate-job-item.service';
import { PopulateJobService } from 'src/populate-job/populate-job.service';
import { Env } from 'utils/types/env';

@Injectable()
export class TaskSchedulingService {
  private readonly maxAttempts: number;

  constructor(
    private readonly apiSteamService: ApiSteamService,
    private readonly gameService: GamesService,
    private readonly populateJobService: PopulateJobService,
    private readonly populateJobItemService: PopulateJobItemService,
    private readonly configService: ConfigService<Env>,
  ) {
    this.maxAttempts = this.configService.get('MAX_JOB_ITEM_ATTEMPTS', {
      infer: true,
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron(): Promise<void> {
    console.log('handleCron started');
    const pendingJob = await this.populateJobService.getPendingOrFailed();
    if (pendingJob == null) {
      console.log('handleCron no pending job');
      return;
    }

    const pendingJobItems =
      await this.populateJobItemService.getPendingOrFailedById(pendingJob.id);

    await this.populateJobService.setRunning(pendingJob);

    try {
      await this.processPendingJobItems(pendingJobItems);
    } catch (err) {
      console.error(`handleCron error: ${JSON.stringify(err, null, 2)}`);
      await this.populateJobService.setFailed(pendingJob);
      return;
    }

    await this.populateJobService.setCompleted(pendingJob);
    console.log('handleCron completed');
  }

  private async processPendingJobItems(
    jobItems: PopulateJobItemEntity[],
  ): Promise<void> {
    const ownedGamesMap = await this.apiSteamService.getFamilyOwnedGamesMap();

    for (const jobItem of jobItems) {
      const isValid = await this.checkJobItemValidity(jobItem, ownedGamesMap);
      if (!isValid) continue;

      await this.handleJobItem(jobItem, ownedGamesMap);
    }
  }

  private async checkJobItemValidity(
    jobItem: PopulateJobItemEntity,
    ownedGamesMap: GameFamilyOwnedMap,
  ): Promise<boolean> {
    if (ownedGamesMap.has(jobItem.gameId)) return true;

    await this.populateJobItemService.setCanceled(jobItem);
    return false;
  }

  private async handleJobItem(
    jobItem: PopulateJobItemEntity,
    ownedGamesMap: GameFamilyOwnedMap,
  ): Promise<void> {
    const ownedGame = ownedGamesMap.get(jobItem.gameId);

    await this.populateJobItemService.setRunning(jobItem);
    try {
      await this.gameService.saveEnrichedGame(ownedGame);

      await this.populateJobItemService.setCompleted(jobItem);
      await this.populateJobService.updateCompletedGames(jobItem.jobId);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        (err.response.status === 400 || err.response.status === 500)
      ) {
        await this.populateJobItemService.setCanceled(jobItem);
        return;
      }

      if (jobItem.attempts >= this.maxAttempts) {
        await this.populateJobItemService.setCanceled(jobItem);
      } else {
        await this.populateJobItemService.setFailed(jobItem);
        throw err;
      }
    }
  }
}
