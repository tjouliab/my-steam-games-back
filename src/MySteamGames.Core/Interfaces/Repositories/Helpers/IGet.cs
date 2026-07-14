namespace MySteamGames.Core.Interfaces.Repositories.Helpers;

public interface IGet<TEntity>
{
    Task<TEntity> Get(int Id);
    Task<IEnumerable<TEntity>> Get();
}