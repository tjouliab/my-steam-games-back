import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { GenreId } from 'src/utils/types/genre-id';
import { TableNames } from '../table-names';

export const genres = sqliteTable(TableNames.Genres, {
  id: integer('id').$type<GenreId>().primaryKey(),
  description: text('description').notNull(),
});
