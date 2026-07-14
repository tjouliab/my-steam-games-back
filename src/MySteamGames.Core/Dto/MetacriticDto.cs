using System.Text.Json.Serialization;

namespace MySteamGames.Core.Dto;

public class MetacriticDto
{
    [JsonPropertyName("score")]
    public required int Score { get; set; }
}
