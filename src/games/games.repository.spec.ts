import { drizzle, NodeSQLiteDatabase } from 'drizzle-orm/node-sqlite';
import { migrate } from 'drizzle-orm/node-sqlite/migrator';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { DatabaseService } from 'src/database/database.service';
import { GameEntity } from 'src/database/entity/game.entity';
import { GenreEntity } from 'src/database/entity/genre.entity';
import { relations } from 'src/database/relations/relations';
import { gameToGenre, genres } from 'src/database/schema';
import { gameStatusEnum } from 'utils/enum/game-status.enum';
import { VisibilityEnum } from 'utils/enum/visibility.enum';
import { gameIdSchema } from 'utils/types/game-id';
import { genreIdSchema } from 'utils/types/genre-id';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GamesRepository } from './games.repository';

describe('GamesRepository', () => {
  let sqlite: DatabaseSync;
  let db: NodeSQLiteDatabase<typeof relations>;
  let repository: GamesRepository;

  const game: GameEntity = {
    id: gameIdSchema.parse(730),
    name: 'Counter-Strike 2',
    imgIconUrl: 'icon',
    metacriticScore: 88,
    positiveReviews: 90,
    negativeReviews: 10,
    playTime: 120,
    lastTimePlayed: 1_700_000_000,
    releaseDate: '2012-08-21',
    initialPrice: 1_499,
    personnalScore: null,
    personnalNotes: null,
    visibilityId: VisibilityEnum.Visible.id,
    statusId: gameStatusEnum.Completed.id,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
    genres: [],
  };

  const actionGenre: GenreEntity = {
    id: genreIdSchema.parse(1),
    description: 'Action',
  };
  const strategyGenre: GenreEntity = {
    id: genreIdSchema.parse(2),
    description: 'Strategy',
  };

  beforeEach(() => {
    sqlite = new DatabaseSync(':memory:');
    sqlite.exec('PRAGMA foreign_keys = ON');
    db = drizzle({ client: sqlite, relations });
    migrate(db, {
      migrationsFolder: path.resolve(__dirname, '../../drizzle'),
    });
    repository = new GamesRepository({ db } as DatabaseService);
  });

  afterEach(() => sqlite.close());

  it('saves a game and replaces its genre relations atomically', () => {
    repository.save({
      ...game,
      genres: [actionGenre, strategyGenre],
    });
    const updatedStrategyGenre = {
      ...strategyGenre,
      description: 'Turn-based strategy',
    };
    repository.save({ ...game, genres: [updatedStrategyGenre] });

    expect(db.select().from(genres).all()).toEqual([
      actionGenre,
      updatedStrategyGenre,
    ]);
    expect(db.select().from(gameToGenre).all()).toEqual([
      { gameId: game.id, genreId: updatedStrategyGenre.id },
    ]);
  });

  it('gets games with their genres', async () => {
    const savedGame = repository.save({
      ...game,
      genres: [actionGenre, strategyGenre],
    });

    await expect(repository.get()).resolves.toEqual([savedGame]);
  });
});
