import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { VisibilityEntity } from '../entity/visibility.entity';
import { TableNames } from '../table-names';

export const visibility = sqliteTable(TableNames.Visibility, {
  id: integer('id').$type<VisibilityEntity['id']>().primaryKey(),
  label: text('label').$type<VisibilityEntity['label']>().notNull().unique(),
});
