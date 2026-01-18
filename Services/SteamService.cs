using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public class SteamService(ILogger<SteamService> logger, IOptions<SteamOptions> options) : ISteamService
{
  private readonly ILogger<SteamService> _logger = logger;
  private readonly string _steamApiKey = options.Value.ApiKey ?? throw new InvalidOperationException("Steam API key is not configured.");
  private readonly IEnumerable<string> _familyPlayersId = options.Value.FamilyPlayersId ?? throw new InvalidOperationException("Steam Family players not configured.");

  public void PopulateGamesTable()
  {
    _logger.LogInformation("_steamApiKey: {_steamApiKey}", _steamApiKey);
    _logger.LogInformation("_familyPlayersId: {_familyPlayersId}", _familyPlayersId);
  }
}
