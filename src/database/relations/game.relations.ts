import { defineRelations } from 'drizzle-orm';
import * as schema from '../schema';

export const gameRelations = defineRelations(schema, (r) => ({
  games: {
    genres: r.many.genres({
      from: r.games.id.through(r.gameToGenre.gameId),
      to: r.genres.id.through(r.gameToGenre.genreId),
    }),

    tags: r.many.tags({
      from: r.games.id.through(r.gameToTag.gameId),
      to: r.tags.id.through(r.gameToTag.tagId),
    }),

    visibility: r.one.visibility({
      from: r.games.visibilityId,
      to: r.visibility.id,
    }),

    status: r.one.gameStatus({
      from: r.games.statusId,
      to: r.gameStatus.id,
    }),
  },
}));
