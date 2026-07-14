namespace MySteamGames.Core.Interfaces.Repositories;

public interface IUpdate<TEntity>
{
    Task Update(TEntity entity);
    Task Update(IEnumerable<TEntity> entites);
}