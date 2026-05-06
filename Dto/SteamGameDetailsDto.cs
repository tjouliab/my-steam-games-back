using System.Text.Json.Serialization;

namespace MySteamGamesBack.Dto;

public class SteamGameDetailsResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("data")]
    public SteamGameDetailsDto? Data { get; set; }
}

public class SteamGameDetailsDto
{
    [JsonPropertyName("release_date")]
    public required ReleaseDateDto ReleaseDate { get; set; }

    [JsonPropertyName("metacritic")]
    public MetacriticDto Metacritic { get; set; } = new MetacriticDto { Score = -1 };

    [JsonPropertyName("genres")]
    public required IEnumerable<GenreDto> Genres { get; set; }

    [JsonPropertyName("price_overview")]
    public PriceOverviewDto PriceOverview { get; set; } = new PriceOverviewDto { Initial = 0 };
}
