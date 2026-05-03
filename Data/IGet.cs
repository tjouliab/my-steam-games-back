namespace MySteamGamesBack.Data;

public interface IGet<TEntity>
{
    Task<TEntity> Get(int Id);
    Task<List<TEntity>> Get();
}