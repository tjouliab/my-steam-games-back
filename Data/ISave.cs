namespace MySteamGamesBack.Data;

public interface ISave<TEntity>
{
    Task Save(TEntity entity);
    Task Save(IEnumerable<TEntity> entities);
}