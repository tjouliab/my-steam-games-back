import { Module } from '@nestjs/common';
import { ApiSteamService } from './api-steam.service';

@Module({
  providers: [ApiSteamService],
})
export class ApiSteamModule {}
