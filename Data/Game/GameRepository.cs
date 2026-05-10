using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class GameRepository(AppDbContext dbContext) : IGameRepository
{
    private readonly AppDbContext _dbContext = dbContext;

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

    public async Task Save(GameEntity entity)
    {
        await Save([entity]);
    }

    public async Task Save(IEnumerable<GameEntity> entities)
    {
        var newGames = await FilterNew(entities);
        if (!newGames.Any()) return;

        var genres = newGames
            .SelectMany(g => g.Genres)
            .DistinctBy(g => g.AppId);

        var genreAppIds = genres
            .Select(g => g.AppId)
            .ToHashSet();

        var trackedGenresByAppId = await _dbContext.Genres
            .Where(g => genreAppIds.Contains(g.AppId))
            .ToDictionaryAsync(g => g.AppId);

        foreach (var genre in genres)
        {
            if (!trackedGenresByAppId.ContainsKey(genre.AppId))
            {
                _dbContext.Genres.Add(genre);
                trackedGenresByAppId[genre.AppId] = genre;
            }
        }

        foreach (var game in newGames)
        {
            game.Genres = game.Genres
                .Select(g => trackedGenresByAppId[g.AppId])
                .ToList();
        }

        _dbContext.Games.AddRange(newGames);

        await _dbContext.SaveChangesAsync();
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

    // TODO: refactor FilterNew to base class
    private async Task<IEnumerable<GameEntity>> FilterNew(IEnumerable<GameEntity> entities)
    {
        var appIds = entities
            .Select(e => e.AppId)
            .Distinct()
            .ToHashSet();

        var existingAppIds = await _dbContext.Games
            .Where(g => appIds.Contains(g.AppId))
            .Select(g => g.AppId)
            .ToHashSetAsync();

        return entities
            .DistinctBy(e => e.AppId)
            .Where(e => !existingAppIds.Contains(e.AppId))
            .ToList();
    }
}