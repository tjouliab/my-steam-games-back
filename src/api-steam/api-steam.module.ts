import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiSteamService } from './api-steam.service';

@Module({
  providers: [ApiSteamService],
  imports: [HttpModule],
  exports: [ApiSteamService],
})
export class ApiSteamModule {}
