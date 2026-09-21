import { createSelectSchema } from 'drizzle-orm/zod';
import { gameIdSchema } from 'src/utils/types/game-id';
import { populateJobIdSchema } from 'src/utils/types/populate-job-id';
import { progressStatusIdSchema } from 'src/utils/types/progress-status';
import z from 'zod';
import { populateJobItem } from '../schema/populate-job-item.schema';

const populateJobItemSchema = createSelectSchema(populateJobItem, {
  jobId: populateJobIdSchema,
  gameId: gameIdSchema,
  progressStatusId: progressStatusIdSchema,
});

export type PopulateJobItemEntity = z.infer<typeof populateJobItemSchema>;
