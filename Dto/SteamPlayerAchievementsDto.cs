using System.Text.Json.Serialization;

namespace MySteamGamesBack.Dto;

public class SteamPlayerAchiementsDto
{
    [JsonPropertyName("playerstats")]
    public required PlayerStats PlayerStats;
}

public class PlayerStats
{
    [JsonPropertyName("gameName")]
    public required string Name;

    [JsonPropertyName("achievements")]
    public required IEnumerable<Achievement> Achievements = [];
}

public class Achievement
{
    [JsonPropertyName("apiname")]
    public required string Name;

    [JsonPropertyName("achieved")]
    public required bool Achieved;

    [JsonPropertyName("unlocktime")]
    public required int UnlockTime;
}