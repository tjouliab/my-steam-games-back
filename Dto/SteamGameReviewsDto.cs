using System.Text.Json.Serialization;

namespace MySteamGamesBack.Dto;

public class SteamGameReviewsDto
{
  [JsonPropertyName("query_summary")]
  public required ReviewsSummaryDto QuerySummary { get; set; }
}
