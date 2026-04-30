using System.Text.Json.Serialization;

namespace MySteamGamesBack.Dto;

public class MetacriticDto
{
  [JsonPropertyName("score")]
  public required int Score { get; set; }
}
