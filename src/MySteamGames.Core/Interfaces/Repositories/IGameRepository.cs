using MySteamGames.Core.Entities;

namespace MySteamGames.Core.Interfaces.Repositories;

public interface IGameRepository :
    IGet<GameEntity>,
    IUpsert<GameEntity>,
    IUpdate<GameEntity>,
    ISoftDelete<GameEntity>
{ }