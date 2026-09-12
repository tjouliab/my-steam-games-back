import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const games = sqliteTable('games', {
  appId: integer('app_id').primaryKey(),
  name: text('name').notNull(),
});
