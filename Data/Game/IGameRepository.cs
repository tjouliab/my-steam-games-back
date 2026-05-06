namespace MySteamGamesBack.Data;

public interface IGameRepository :
    IGet<GameEntity>,
    ISave<GameEntity>,
    IUpdate<GameEntity>,
    ISoftDelete<GameEntity>
{ }