namespace MySteamGames.Core.Interfaces.Repositories;

public interface ITrackExisting<TEntity>
{
    Task<IReadOnlyDictionary<int, TEntity>> TrackExisting(IEnumerable<TEntity> entites);
}