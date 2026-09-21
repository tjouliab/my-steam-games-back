import { TypedRoute } from '@nestia/core';
import {
  Controller,
  SerializeOptions,
  StandardSchemaSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { gameSchema } from 'src/database/entity/game.entity';
import { GamesResponse, gamesResponseSchema } from './contracts/games.contract';
import { GamesService } from './games.service';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @TypedRoute.Get()
  @UseInterceptors(StandardSchemaSerializerInterceptor)
  @SerializeOptions({ schema: gameSchema })
  @ApiOkResponse({
    description: 'Games stored in the library',
    standardSchema: gamesResponseSchema,
  })
  async get(): Promise<GamesResponse> {
    return this.gamesService.get();
  }

  @TypedRoute.Post('populate-table')
  async populateTable(): Promise<void> {
    return this.gamesService.populateTable();
  }
}
