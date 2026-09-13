import { Controller, Post } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('populate-table')
  async populateTable(): Promise<void> {
    return this.gamesService.populateTable();
  }
}
