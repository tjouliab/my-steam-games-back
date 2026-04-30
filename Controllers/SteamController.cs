using Microsoft.AspNetCore.Mvc;
using Microsoft.JSInterop.Infrastructure;
using MySteamGamesBack.Models;
using MySteamGamesBack.Services;

namespace MySteamGamesBack.Controllers;

[ApiController]
[Route("steam")]
public class SteamController(ISteamService steamService, ILogger<SteamController> logger) : ControllerBase
{
  private readonly ISteamService _steamService = steamService;
  private readonly ILogger<SteamController> _logger = logger;

  [HttpPost("populate-games-table")]
  public async Task<ActionResult<List<SteamGameEnriched>>> PopulateGamesTable()
  {
    var games = await _steamService.PopulateGamesTable();
    return Ok(games);
  }
}
