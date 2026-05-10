namespace MySteamGamesBack.Models;

public class SteamOptions
{
    public string? ApiKey { get; }
    public string? PlayerId { get; }
    public IEnumerable<string>? FamilyPlayersId { get; }
}