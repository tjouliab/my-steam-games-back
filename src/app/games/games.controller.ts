import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { GameEditBody } from './contracts/game-edit.contract';
import { GamesResponse } from './contracts/games.contract';
import { GamesService } from './games.service';

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

  @TypedRoute.Post('edit-one')
  async editOne(@TypedBody() body: GameEditBody): Promise<void> {
    return this.gamesService.editOne(body);
  }
}
