import { Module } from '@nestjs/common';
import { ApiSteamModule } from 'src/api-steam/api-steam.module';
import { PopulateJobModule } from 'src/populate-job/populate-job.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [ApiSteamModule, PopulateJobModule],
})
export class GamesModule {}
