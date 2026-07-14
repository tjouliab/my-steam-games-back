namespace MySteamGamesBack.Data;

public interface ISoftDelete<TEntity>
{
    Task SoftDelete(TEntity entity);
    Task SoftDelete(IEnumerable<TEntity> entities);
}