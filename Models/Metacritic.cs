using System.Text.Json.Serialization;

namespace MySteamGamesBack.Models;

public class Metacritic
{
  [JsonPropertyName("score")]
  public required int Score { get; set; }
}
