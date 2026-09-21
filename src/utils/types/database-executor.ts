import {
  NodeSQLiteDatabase,
  NodeSQLiteTransaction,
} from 'drizzle-orm/node-sqlite';
import type { relations } from 'src/database/relations/relations';

export type DatabaseExecutor =
  | NodeSQLiteDatabase<typeof relations>
  | NodeSQLiteTransaction<typeof relations>;
