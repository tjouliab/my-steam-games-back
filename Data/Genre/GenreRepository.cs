using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class GenreRepository(AppDbContext dbContext) : IGenreRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<GenreEntity> Get(int Id)
    {
        var genre = await _dbContext.Genres.FindAsync(Id);

        if (genre == null) throw new KeyNotFoundException($"Game with id {Id} was not found.");

        return genre;
    }

    public async Task<List<GenreEntity>> Get()
    {
        return await _dbContext.Genres.ToListAsync();
    }

    public async Task Save(GenreEntity entity)
    {
        _dbContext.Genres.Add(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Save(List<GenreEntity> entities)
    {
        _dbContext.Genres.AddRange(entities);
        await _dbContext.SaveChangesAsync();
    }
}

