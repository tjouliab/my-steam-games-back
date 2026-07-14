using System.Text.Json.Serialization;

namespace MySteamGames.Core.Dto;

public class SteamGameReviewsDto
{
    [JsonPropertyName("query_summary")]
    public required ReviewsSummaryDto ReviewsSummary { get; set; }
}
