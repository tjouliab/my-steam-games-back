import { EmptyRelations } from 'drizzle-orm';
import {
  NodeSQLiteDatabase,
  NodeSQLiteTransaction,
} from 'drizzle-orm/node-sqlite';

export type DatabaseExecutor =
  NodeSQLiteDatabase<EmptyRelations> | NodeSQLiteTransaction<EmptyRelations>;
