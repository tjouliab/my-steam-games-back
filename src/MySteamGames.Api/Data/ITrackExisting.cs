namespace MySteamGamesBack.Data;

public interface ITrackExisting<TEntity>
{
    Task<IReadOnlyDictionary<int, TEntity>> TrackExisting(IEnumerable<TEntity> entites);
}