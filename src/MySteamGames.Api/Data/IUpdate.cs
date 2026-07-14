namespace MySteamGamesBack.Data;

public interface IUpdate<TEntity>
{
    Task Update(TEntity entity);
    Task Update(IEnumerable<TEntity> entites);
}