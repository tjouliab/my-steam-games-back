import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodeSQLiteDatabase } from 'drizzle-orm/node-sqlite';
import { DatabaseSync } from 'node:sqlite';
import { EmptyRelations } from 'node_modules/drizzle-orm/index.cjs';
import { Env } from 'utils/types/env';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly sqlite: DatabaseSync;

  public readonly db: NodeSQLiteDatabase<EmptyRelations>;

  constructor(private readonly configService: ConfigService<Env>) {
    const databaseFile = this.configService.get('DB_FILE_NAME', {
      infer: true,
    });

    this.sqlite = new DatabaseSync(databaseFile);

    this.sqlite.exec('PRAGMA foreign_keys = ON');
    this.sqlite.exec('PRAGMA journal_mode = WAL');

    this.db = drizzle({
      client: this.sqlite,
    });
  }

  onModuleDestroy() {
    this.sqlite.close();
  }
}
