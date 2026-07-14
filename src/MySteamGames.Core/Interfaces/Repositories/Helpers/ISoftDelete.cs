namespace MySteamGames.Core.Interfaces.Repositories.Helpers;

public interface ISoftDelete<TEntity>
{
    Task SoftDelete(TEntity entity);
    Task SoftDelete(IEnumerable<TEntity> entities);
}