using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public interface IGameService
{
    Task<List<SteamGameEnriched>> PopulateGamesTable();
}
