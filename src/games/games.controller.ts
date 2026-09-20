import { Controller, Get, Post } from '@nestjs/common';
import { GameEntity } from 'src/database/entity/game.entity';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async get(): Promise<GameEntity[]> {
    return this.gamesService.get();
  }

  @Post('populate-table')
  async populateTable(): Promise<void> {
    return this.gamesService.populateTable();
  }
}
