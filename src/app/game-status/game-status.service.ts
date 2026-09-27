import { Injectable } from '@nestjs/common';
import { GameStatusResponse } from 'sdk/structures/GameStatusResponse';
import { GameStatusEnum } from 'src/utils/enum/game-status.enum';

@Injectable()
export class GameStatusService {
  get(): GameStatusResponse {
    return Object.values(GameStatusEnum).reduce((acc, val) => {
      acc[String(val.id)] = val.label;
      return acc;
    }, {} as GameStatusResponse);
  }
}
