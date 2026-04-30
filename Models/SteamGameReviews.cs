using System.Text.Json.Serialization;

namespace MySteamGamesBack.Models;

public class SteamGameReviews
{
  [JsonPropertyName("query_summary")]
  public required ReviewsSummary QuerySummary { get; set; }
}
