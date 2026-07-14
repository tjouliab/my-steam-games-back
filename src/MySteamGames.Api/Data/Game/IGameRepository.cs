namespace MySteamGamesBack.Data;

public interface IGameRepository :
    IGet<GameEntity>,
    IUpsert<GameEntity>,
    IUpdate<GameEntity>,
    ISoftDelete<GameEntity>
{ }