using Microsoft.AspNetCore.Mvc;
using Microsoft.JSInterop.Infrastructure;
using MySteamGamesBack.Models;
using MySteamGamesBack.Services;

namespace MySteamGamesBack.Controllers;

[ApiController]
[Route("steam")]
public class GameController(IGameService gameService) : ControllerBase
{
    private readonly IGameService _gameService = gameService;

    [HttpPost("populate-games-table")]
    public async Task<OkResult> PopulateGamesTable()
    {
        await _gameService.PopulateGamesTable();
        return Ok();
    }
}
