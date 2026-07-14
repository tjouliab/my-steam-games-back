namespace MySteamGames.Core.Interfaces.Repositories;

public interface IGet<TEntity>
{
    Task<TEntity> Get(int Id);
    Task<IEnumerable<TEntity>> Get();
}