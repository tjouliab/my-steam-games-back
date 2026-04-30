using System.Text.Json.Serialization;

namespace MySteamGamesBack.Models;

public class PriceOverview
{
  [JsonPropertyName("initial")]
  public required int Initial { get; set; }
}
