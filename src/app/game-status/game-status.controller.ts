import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { GameStatusResponse } from 'sdk/structures/GameStatusResponse';
import { GameStatusService } from './game-status.service';

@Controller('game-status')
export class GameStatusController {
  constructor(private readonly gameStatusService: GameStatusService) {}

  @TypedRoute.Get()
  async get(): Promise<GameStatusResponse> {
    return this.gameStatusService.get();
  }
}
