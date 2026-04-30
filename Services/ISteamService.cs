using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public interface ISteamService
{
  Task<List<SteamGameEnriched>> PopulateGamesTable();
}
