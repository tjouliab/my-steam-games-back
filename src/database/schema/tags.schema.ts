import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { TagId } from 'utils/types/tag-id';
import { TableNames } from '../table-names';

export const tags = sqliteTable(TableNames.Tags, {
  id: integer('id').$type<TagId>().primaryKey({ autoIncrement: true }),
  description: text('description').notNull(),
});
