import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from 'utils/types/env';
import { ApiSteamModule } from './api-steam/api-steam.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GamesModule } from './games/games.module';
import { PopulateJobModule } from './populate-job/populate-job.module';
import { PopulateJobItemModule } from './populate-job-item/populate-job-item.module';

@Module({
  imports: [
    ApiSteamModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    DatabaseModule,
    GamesModule,
    PopulateJobModule,
    PopulateJobItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
