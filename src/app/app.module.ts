import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { envSchema } from 'src/utils/types/env';
import { ApiSteamModule } from './api-steam/api-steam.module';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { PopulateJobItemModule } from './populate-job-item/populate-job-item.module';
import { PopulateJobModule } from './populate-job/populate-job.module';
import { TaskSchedulingModule } from './task-scheduling/task-scheduling.module';
import { ObserveModule } from './observe';
import { GameStatusModule } from './game-status/game-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY!,
      appSecret: process.env.OBSERVE_APP_SECRET!,
      serviceId: process.env.OBSERVE_SERVICE_ID!,
    }),
    ScheduleModule.forRoot(),

    ApiSteamModule,
    DatabaseModule,
    GamesModule,
    PopulateJobModule,
    PopulateJobItemModule,
    TaskSchedulingModule,
    GameStatusModule,
  ],
  providers: [AppService],
})
export class AppModule {}
