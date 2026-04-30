using System.Text.Json.Serialization;

namespace MySteamGamesBack.Models;

public class SteamGameReviews
{
  [JsonPropertyName("query_summary")]
  public required ReviewsSummary QuerySummary { get; set; }
}

public class ReviewsSummary
{
  [JsonPropertyName("total_positive")]
  public required int TotalPositive { get; set; }

  [JsonPropertyName("total_negative")]
  public required int TotalNegative { get; set; }
}