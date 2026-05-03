using Microsoft.AspNetCore.Mvc;
using Microsoft.JSInterop.Infrastructure;
using MySteamGamesBack.Models;
using MySteamGamesBack.Services;

namespace MySteamGamesBack.Controllers;

[ApiController]
[Route("steam")]
public class GameController(IGameService gameService, ILogger<GameController> logger) : ControllerBase
{
    private readonly IGameService _gameService = gameService;
    private readonly ILogger<GameController> _logger = logger;

    [HttpPost("populate-games-table")]
    public async Task<ActionResult<List<SteamGameEnriched>>> PopulateGamesTable()
    {
        var games = await _gameService.PopulateGamesTable();
        return Ok(games);
    }
}
