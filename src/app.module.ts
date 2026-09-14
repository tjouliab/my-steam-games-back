import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { envSchema } from 'utils/types/env';
import { ApiSteamModule } from './api-steam/api-steam.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GamesModule } from './games/games.module';
import { PopulateJobItemModule } from './populate-job-item/populate-job-item.module';
import { PopulateJobModule } from './populate-job/populate-job.module';
import { TaskSchedulingModule } from './task-scheduling/task-scheduling.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    ScheduleModule.forRoot(),

    ApiSteamModule,
    DatabaseModule,
    GamesModule,
    PopulateJobModule,
    PopulateJobItemModule,
    TaskSchedulingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
