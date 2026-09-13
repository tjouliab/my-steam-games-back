import { Module } from '@nestjs/common';
import { PopulateJobItemModule } from 'src/populate-job-item/populate-job-item.module';
import { PopulateJobRepository } from './populate-job.repository';
import { PopulateJobService } from './populate-job.service';

@Module({
  providers: [PopulateJobService, PopulateJobRepository],
  imports: [PopulateJobItemModule],
  exports: [PopulateJobService],
})
export class PopulateJobModule {}
