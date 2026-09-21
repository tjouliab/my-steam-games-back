import { Module } from '@nestjs/common';
import { PopulateJobItemRepository } from './populate-job-item.repository';
import { PopulateJobItemService } from './populate-job-item.service';

@Module({
  providers: [PopulateJobItemService, PopulateJobItemRepository],
  exports: [PopulateJobItemService],
})
export class PopulateJobItemModule {}
