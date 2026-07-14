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

    public async Task<IReadOnlyDictionary<int, TagEntity>> TrackExisting(IEnumerable<TagEntity> entities)
    {
        var incomingTags = entities
            .DistinctBy(e => e.Id)
            .ToList();

        if (incomingTags.Count == 0) return new Dictionary<int, TagEntity>();

        var incomingIds = incomingTags
            .Select(t => t.Id)
            .ToHashSet();

        var trackedById = await _dbContext.Tags
            .Where(t => incomingIds.Contains(t.Id))
            .ToDictionaryAsync(t => t.Id);

        foreach (var incomingTag in incomingTags)
        {
            if (trackedById.TryGetValue(incomingTag.Id, out var existingTag)) continue;

            _dbContext.Tags.Add(incomingTag);
            trackedById.Add(incomingTag.Id, incomingTag);
        }

        return trackedById;
    }
}