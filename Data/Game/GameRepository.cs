using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class GameRepository(
    AppDbContext dbContext,
    IGenreRepository genreRepository
    ) : IGameRepository
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IGenreRepository _genreRepository = genreRepository;

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
            .Where(g => incomingAppIds.Contains(g.AppId))
            .ToDictionaryAsync(g => g.AppId);

        var trackedGenresByAppId = await _genreRepository.TrackExisting(
            incomingGames.SelectMany(game => game.Genres));

        foreach (var incomingGame in incomingGames)
        {
            var desiredGenres = incomingGame.Genres
                .Select(g => trackedGenresByAppId[g.AppId])
                .ToList();

            // Update existing game
            if (trackedGamesByAppId.TryGetValue(incomingGame.AppId, out var existingGame))
            {
                UpdateExisting(existingGame, incomingGame);

                UpdateExistingGenres(
                    existingGame.Genres,
                    desiredGenres
                );

                continue;
            }

            // Insert new game
            incomingGame.Genres = desiredGenres;

            _dbContext.Games.Add(incomingGame);
        }

        await _dbContext.SaveChangesAsync();
    }

    private static void UpdateExisting(GameEntity existingGame, GameEntity incomingGame)
    {
        existingGame.PositiveReviews = incomingGame.PositiveReviews;
        existingGame.NegativeReviews = incomingGame.NegativeReviews;
        existingGame.MetacriticScore = incomingGame.MetacriticScore;
        existingGame.PlayTime = incomingGame.PlayTime;
        existingGame.UpdatedAt = incomingGame.UpdatedAt;
        // If the game is coming from a family member, LastTimePlayed is null so it should be set by hand afterwards
        existingGame.LastTimePlayed ??= incomingGame.LastTimePlayed;
        if (incomingGame.Status == StatusesEnum.Completed)
        {
            existingGame.Status = StatusesEnum.Completed;
        }
        // Update the visibility only if it has been set to default
        if (existingGame.Visibility == VisibilityEnum.HiddenDefault)
        {
            existingGame.Visibility = incomingGame.Visibility;
        }
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
        // ToList is mandatory to avoid removing from the same list we iterate over
        foreach (var currentGenre in currentGenres.ToList())
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
