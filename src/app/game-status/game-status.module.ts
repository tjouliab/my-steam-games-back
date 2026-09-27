import { Module } from '@nestjs/common';
import { GameStatusController } from './game-status.controller';
import { GameStatusService } from './game-status.service';

@Module({
  controllers: [GameStatusController],
  providers: [GameStatusService],
})
export class GameStatusModule {}
