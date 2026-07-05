namespace MySteamGamesBack.Data;

public interface IUpsert<TEntity>
{
    Task Upsert(TEntity entity);
    Task Upsert(IEnumerable<TEntity> entities);
}