import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiSteamService } from 'src/api-steam/api-steam.service';
import { PopulateJobService } from 'src/populate-job/populate-job.service';
import { Env } from 'utils/types/env';

@Injectable()
export class GamesService {
  constructor(
    private readonly apiSteamService: ApiSteamService,
    private readonly populateJobService: PopulateJobService,
    private readonly configService: ConfigService<Env>,
  ) {}

  async populateTable(): Promise<void> {
    if (await this.populateJobService.isAlreadyRunningOrPending()) return;

    const playerId = this.configService.get('PLAYER_ID', { infer: true });
    const ownedGames = await this.apiSteamService.getOwnedGames(playerId);

    const gameIds = ownedGames.map((g) => g.gameId);
    await this.populateJobService.registerGames(gameIds);
  }
}
