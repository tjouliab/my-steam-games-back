import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodeSQLiteDatabase } from 'drizzle-orm/node-sqlite';
import { DatabaseSync } from 'node:sqlite';
import { Env } from 'utils/types/env';
import { relations } from './relations/relations';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly sqlite: DatabaseSync;

  public readonly db: NodeSQLiteDatabase<typeof relations>;

  constructor(private readonly configService: ConfigService<Env, true>) {
    const databaseFile = this.configService.get('DB_FILE_NAME', {
      infer: true,
    });

    this.sqlite = new DatabaseSync(databaseFile);

    this.sqlite.exec('PRAGMA foreign_keys = ON');
    this.sqlite.exec('PRAGMA journal_mode = WAL');

    this.db = drizzle({
      client: this.sqlite,
      relations,
    });
  }

  onModuleDestroy() {
    this.sqlite.close();
  }
}
