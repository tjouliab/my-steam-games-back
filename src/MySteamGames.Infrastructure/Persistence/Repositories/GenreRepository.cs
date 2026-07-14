using Microsoft.EntityFrameworkCore;
using MySteamGames.Core.Entities;
using MySteamGames.Core.Interfaces.Repositories;

namespace MySteamGames.Infrastructure.Persistence.Repositories;

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

    public async Task<IReadOnlyDictionary<int, GenreEntity>> TrackExisting(IEnumerable<GenreEntity> entities)
    {
        var incomingGenres = entities
            .DistinctBy(e => e.AppId)
            .ToList();

        if (incomingGenres.Count == 0) return new Dictionary<int, GenreEntity>();

        var incomingAppIds = incomingGenres
            .Select(g => g.AppId)
            .ToHashSet();

        var trackedByAppId = await _dbContext.Genres
            .Where(g => incomingAppIds.Contains(g.AppId))
            .ToDictionaryAsync(g => g.AppId);

        foreach (var incomingGenre in incomingGenres)
        {
            if (trackedByAppId.TryGetValue(incomingGenre.AppId, out var existingGenre)) continue;

            _dbContext.Genres.Add(incomingGenre);
            trackedByAppId.Add(incomingGenre.AppId, incomingGenre);
        }

        return trackedByAppId;
    }
}

