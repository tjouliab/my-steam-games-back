import { Module } from '@nestjs/common';
import { ApiSteamModule } from 'src/api-steam/api-steam.module';
import { PopulateJobModule } from 'src/populate-job/populate-job.module';
import { GamesController } from './games.controller';
import { GamesRepository } from './games.repository';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, GamesRepository],
  imports: [ApiSteamModule, PopulateJobModule],
  exports: [GamesService],
})
export class GamesModule {}
