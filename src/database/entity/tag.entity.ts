import { createSelectSchema } from 'drizzle-orm/zod';
import { tagIdSchema } from 'src/utils/types/tag-id';
import z from 'zod';
import { tags } from '../schema';

const tagSchema = createSelectSchema(tags, {
  id: tagIdSchema,
});

export type TagEntity = z.infer<typeof tagSchema>;
