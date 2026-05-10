using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class GenreRepository(AppDbContext dbContext) : IGenreRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<GenreEntity> Get(int Id)
    {
        var genre = await _dbContext.Genres.FindAsync(Id);

        if (genre == null) throw new KeyNotFoundException($"Genre with id {Id} was not found.");

        return genre;
    }

    public async Task<IEnumerable<GenreEntity>> Get()
    {
        return await _dbContext.Genres.ToListAsync();
    }

    public async Task Save(GenreEntity entity)
    {
        await Save([entity]);
    }

    public async Task Save(IEnumerable<GenreEntity> entities)
    {
        var newEntities = await FilterNew(entities);

        _dbContext.Genres.AddRange(newEntities);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<IEnumerable<GenreEntity>> FilterNew(IEnumerable<GenreEntity> entities)
    {
        var appIds = entities
            .Select(e => e.AppId)
            .Distinct()
            .ToHashSet();

        var existingGenres = await _dbContext.Genres
            .Where(g => appIds.Contains(g.AppId))
            .Select(g => g.AppId)
            .ToHashSetAsync();

        return entities
            .DistinctBy(e => e.AppId)
            .Where(e => !existingGenres.Contains(e.AppId))
            .ToList();
    }
}

