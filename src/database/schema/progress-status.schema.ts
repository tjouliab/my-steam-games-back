import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  ProgressStatusId,
  ProgressStatusLabel,
} from 'utils/types/progress-status';
import { TableNames } from '../table-names';

export const progressStatus = sqliteTable(TableNames.ProgressStatus, {
  id: integer('id').$type<ProgressStatusId>().primaryKey(),
  label: text('label').$type<ProgressStatusLabel>().notNull().unique(),
});
