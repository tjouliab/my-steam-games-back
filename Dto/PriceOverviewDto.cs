using System.Text.Json.Serialization;

namespace MySteamGamesBack.Dto;

public class PriceOverviewDto
{
  [JsonPropertyName("initial")]
  public required int Initial { get; set; }
}
