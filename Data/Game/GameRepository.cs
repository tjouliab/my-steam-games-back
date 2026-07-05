using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class GameRepository(
    AppDbContext dbContext,
    IGenreRepository genreRepository,
    ITagRepository tagRepository
    ) : IGameRepository
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IGenreRepository _genreRepository = genreRepository;
    private readonly ITagRepository _tagRepository = tagRepository;

    public async Task<GameEntity> Get(int Id)
    {
        var game = await _dbContext.Games.FindAsync(Id);

        if (game == null) throw new KeyNotFoundException($"Game with id {Id} was not found.");

        return game;
    }

    public async Task<IEnumerable<GameEntity>> Get()
    {
        return await _dbContext.Games.ToListAsync();
    }

    public async Task Upsert(GameEntity entity)
    {
        await Upsert([entity]);
    }

    public async Task Upsert(IEnumerable<GameEntity> entities)
    {
        var incomingGames = entities
            .DistinctBy(g => g.AppId)
            .ToList();

        if (incomingGames.Count == 0) return;

        var incomingAppIds = incomingGames
            .Select(g => g.AppId)
            .ToHashSet();

        var trackedGamesByAppId = await _dbContext.Games
            .Include(g => g.Genres)
            .Include(g => g.Tags)
            .Where(g => incomingAppIds.Contains(g.AppId))
            .ToDictionaryAsync(g => g.AppId);

        var trackedGenresByAppId = await _genreRepository.TrackExisting(
            incomingGames.SelectMany(game => game.Genres));
        var trackedTagsById = await _tagRepository.TrackExisting(
            incomingGames.SelectMany(game => game.Tags));

        foreach (var incomingGame in incomingGames)
        {
            var desiredGenres = incomingGame.Genres
                .Select(g => trackedGenresByAppId[g.AppId])
                .ToList();

            var desiredTags = incomingGame.Tags
                .Select(t => trackedTagsById[t.Id])
                .ToList();

            // Update existing game
            if (trackedGamesByAppId.TryGetValue(incomingGame.AppId, out var existingGame))
            {
                UpdateExisting(existingGame, incomingGame);

                UpdateExistingGenres(
                    existingGame.Genres,
                    desiredGenres
                );

                UpdateExistingTags(
                    existingGame.Tags,
                    desiredTags
                );

                continue;
            }

            // Insert new game
            incomingGame.Genres = desiredGenres;
            incomingGame.Tags = desiredTags;

            _dbContext.Games.Add(incomingGame);
        }

        await _dbContext.SaveChangesAsync();
    }

    private static void UpdateExisting(GameEntity existingGame, GameEntity incomingGame)
    {
        existingGame.PositiveReviews = incomingGame.PositiveReviews;
        existingGame.NegativeReviews = incomingGame.NegativeReviews;
        existingGame.LastTimePlayed = incomingGame.LastTimePlayed;
        existingGame.PlayTime = incomingGame.PlayTime;
        existingGame.UpdatedAt = incomingGame.UpdatedAt;
    }

    private static void UpdateExistingGenres(List<GenreEntity> currentGenres, IEnumerable<GenreEntity> desiredGenres)
    {
        var desiredKeys = desiredGenres
            .Select(g => g.AppId)
            .ToHashSet();

        var currentKeys = currentGenres
            .Select(g => g.AppId)
            .ToHashSet();

        // Remove previous genres if not needed
        foreach (var currentGenre in currentGenres)
        {
            if (!desiredKeys.Contains(currentGenre.AppId))
            {
                currentGenres.Remove(currentGenre);
            }
        }

        // Add new genres
        foreach (var desiredGenre in desiredGenres)
        {
            if (currentKeys.Add(desiredGenre.AppId))
            {
                currentGenres.Add(desiredGenre);
            }
        }
    }

    private static void UpdateExistingTags(List<TagEntity> currentTags, IEnumerable<TagEntity> desiredTags)
    {
        var desiredKeys = desiredTags
            .Select(g => g.Id)
            .ToHashSet();

        var currentKeys = currentTags
            .Select(g => g.Id)
            .ToHashSet();

        // Remove previous tags if not needed
        foreach (var currentTag in currentTags)
        {
            if (!desiredKeys.Contains(currentTag.Id))
            {
                currentTags.Remove(currentTag);
            }
        }

        // Add new tags
        foreach (var desiredTag in desiredTags)
        {
            if (currentKeys.Add(desiredTag.Id))
            {
                currentTags.Add(desiredTag);
            }
        }
    }

    Task ISoftDelete<GameEntity>.SoftDelete(GameEntity entity)
    {
        throw new NotImplementedException();
    }

    Task ISoftDelete<GameEntity>.SoftDelete(IEnumerable<GameEntity> entities)
    {
        throw new NotImplementedException();
    }

    Task IUpdate<GameEntity>.Update(GameEntity entity)
    {
        throw new NotImplementedException();
    }

    Task IUpdate<GameEntity>.Update(IEnumerable<GameEntity> entites)
    {
        throw new NotImplementedException();
    }
}
