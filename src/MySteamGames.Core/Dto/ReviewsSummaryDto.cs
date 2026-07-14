using System.Text.Json.Serialization;

namespace MySteamGames.Core.Dto;

public class ReviewsSummaryDto
{
	[JsonPropertyName("total_positive")]
	public required int TotalPositive { get; set; }

	[JsonPropertyName("total_negative")]
	public required int TotalNegative { get; set; }
}