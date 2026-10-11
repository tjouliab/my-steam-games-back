import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { GameStatusService } from './game-status.service';
import { GameStatusResponse } from './contracts/game-status.contract';

@Controller('game-status')
export class GameStatusController {
  constructor(private readonly gameStatusService: GameStatusService) {}

  @TypedRoute.Get()
  async get(): Promise<GameStatusResponse> {
    return this.gameStatusService.get();
  }
}
