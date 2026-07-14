using System.Text.Json.Serialization;

namespace MySteamGames.Core.Dto;

public class SteamPlayerAchiementsDto
{
    [JsonPropertyName("playerstats")]
    public required PlayerStats PlayerStats { get; set; }
}

public class PlayerStats
{
    [JsonPropertyName("gameName")]
    public string? Name { get; set; }

    [JsonPropertyName("achievements")]
    public IEnumerable<Achievement> Achievements { get; set; } = [];
}

public class Achievement
{
    [JsonPropertyName("apiname")]
    public required string Name { get; set; }

    // Represents 0/1 instead of true/false
    [JsonPropertyName("achieved")]
    public required int Achieved { get; set; }

    [JsonPropertyName("unlocktime")]
    public required int UnlockTime { get; set; }
}