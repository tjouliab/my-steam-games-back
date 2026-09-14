import { Module } from '@nestjs/common';
import { ApiSteamModule } from 'src/api-steam/api-steam.module';
import { GamesModule } from 'src/games/games.module';
import { PopulateJobItemModule } from 'src/populate-job-item/populate-job-item.module';
import { PopulateJobModule } from 'src/populate-job/populate-job.module';
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
