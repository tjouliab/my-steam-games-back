import { Injectable } from '@nestjs/common';
import { GameStatusEnum } from 'src/utils/enum/game-status.enum';
import { GameStatusResponse } from './contracts/game-status.contract';

@Injectable()
export class GameStatusService {
  get(): GameStatusResponse {
    return Object.values(GameStatusEnum).reduce((acc, val) => {
      acc[String(val.id)] = val.label;
      return acc;
    }, {} as GameStatusResponse);
  }
}
