namespace MySteamGames.Core.Interfaces.Repositories.Helpers;

public interface IUpsert<TEntity>
{
    Task Upsert(TEntity entity);
    Task Upsert(IEnumerable<TEntity> entities);
}