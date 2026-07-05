using Microsoft.EntityFrameworkCore;

namespace MySteamGamesBack.Data;

public class TagRepository(AppDbContext dbContext) : ITagRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<TagEntity> Get(int Id)
    {
        var tag = await _dbContext.Tags.FindAsync(Id);

        if (tag == null) throw new KeyNotFoundException($"Tag with id {Id} was not found.");

        return tag;
    }

    public async Task<IEnumerable<TagEntity>> Get()
    {
        return await _dbContext.Tags.ToListAsync();
    }

    public async Task Upsert(TagEntity entity)
    {
        await Upsert([entity]);
    }

    public async Task Upsert(IEnumerable<TagEntity> entities)
    {
        var newEntities = await FilterNew(entities);

        _dbContext.Tags.AddRange(newEntities);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<IEnumerable<TagEntity>> FilterNew(IEnumerable<TagEntity> entities)
    {
        var ids = entities
            .Select(e => e.Id)
            .Distinct()
            .ToHashSet();

        var existingTags = await _dbContext.Tags
            .Where(t => ids.Contains(t.Id))
            .Select(t => t.Id)
            .ToHashSetAsync();

        return entities
            .DistinctBy(e => e.Id)
            .Where(e => !existingTags.Contains(e.Id))
            .ToList();
    }
}