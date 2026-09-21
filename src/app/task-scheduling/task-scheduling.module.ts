import { Module } from '@nestjs/common';
import { ApiSteamModule } from 'src/app/api-steam/api-steam.module';
import { GamesModule } from '../games/games.module';
import { PopulateJobItemModule } from '../populate-job-item/populate-job-item.module';
import { PopulateJobModule } from '../populate-job/populate-job.module';
import { TaskSchedulingService } from './task-scheduling.service';

@Module({
  providers: [TaskSchedulingService],
  imports: [
    ApiSteamModule,
    GamesModule,
    PopulateJobModule,
    PopulateJobItemModule,
  ],
})
export class TaskSchedulingModule {}
