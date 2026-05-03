using Microsoft.Extensions.Options;
using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public class GameService(ILogger<GameService> logger, ISteamService steamService) : IGameService
{
    private readonly ILogger<GameService> _logger = logger;
    private readonly ISteamService _steamService = steamService;

    public async Task<List<SteamGameEnriched>> PopulateGamesTable()
    {
        var familyGames = _steamService.GetFamilyGamesDistinct();

        // return await EnrichPlayerGames(familyGames);
        return [];
    }


}