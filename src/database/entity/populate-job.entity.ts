import { createSelectSchema } from 'drizzle-orm/zod';
import { populateJobIdSchema } from 'src/utils/types/populate-job-id';
import { progressStatusIdSchema } from 'src/utils/types/progress-status';
import z from 'zod';
import { populateJob } from '../schema/populate-job.schema';

const populateJobSchema = createSelectSchema(populateJob, {
  id: populateJobIdSchema,
  progressStatusId: progressStatusIdSchema,
});

export type PopulateJobEntity = z.infer<typeof populateJobSchema>;
