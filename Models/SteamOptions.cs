namespace MySteamGamesBack.Models;

public class SteamOptions
{
    public string? ApiKey { get; set; }
    public string? PlayerId { get; set; }
    public IEnumerable<string>? FamilyPlayersId { get; set; }
}