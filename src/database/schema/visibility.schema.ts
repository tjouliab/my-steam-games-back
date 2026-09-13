import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { VisibilityId, VisibilityLabel } from 'utils/types/visibility';
import { TableNames } from '../table-names';

export const visibility = sqliteTable(TableNames.Visibility, {
  id: integer('id').$type<VisibilityId>().primaryKey(),
  label: text('label').$type<VisibilityLabel>().notNull().unique(),
});
