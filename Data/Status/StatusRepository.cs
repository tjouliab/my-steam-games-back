using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class StatusRepository(AppDbContext dbContext) : IStatusRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<StatusEntity> Get(int Id)
    {
        var status = await _dbContext.Statuses.FindAsync(Id);

        if (status == null) throw new KeyNotFoundException($"Status with id {Id} was not found.");

        return status;
    }

    public async Task<List<StatusEntity>> Get()
    {
        return await _dbContext.Statuses.ToListAsync();
    }
}