import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GamesResponse } from './contracts/games.contract';
import { GamesService } from './games.service';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @TypedRoute.Get()
  async get(): Promise<GamesResponse> {
    return this.gamesService.get();
  }

  @TypedRoute.Post('populate-table')
  async populateTable(): Promise<void> {
    return this.gamesService.populateTable();
  }
}
