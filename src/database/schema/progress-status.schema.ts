import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { ProgressStatusEntity } from '../entity/progress-status.entity';
import { TableNames } from '../table-names';

export const progressStatus = sqliteTable(TableNames.ProgressStatus, {
  id: integer('id').$type<ProgressStatusEntity['id']>().primaryKey(),
  label: text('label')
    .$type<ProgressStatusEntity['label']>()
    .notNull()
    .unique(),
});
