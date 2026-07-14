using System.Text.Json.Serialization;

namespace MySteamGames.Core.Dto;

public class PriceOverviewDto
{
    [JsonPropertyName("initial")]
    public required int Initial { get; set; }
}
