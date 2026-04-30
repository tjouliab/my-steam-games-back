using System.Text.Json.Serialization;

namespace MySteamGamesBack.Models;

public class SteamGameDetailsResponse
{
  [JsonPropertyName("success")]
  public bool Success { get; set; }

  [JsonPropertyName("data")]
  public SteamGameDetails? Data { get; set; }
}

public class SteamGameDetails
{
  [JsonPropertyName("release_date")]
  public required ReleaseDate ReleaseDate { get; set; }

  [JsonPropertyName("metacritic")]
  public Metacritic Metacritic { get; set; } = new Metacritic { Score = -1 };

  [JsonPropertyName("genres")]
  public required List<Genre> Genres { get; set; }

  [JsonPropertyName("price_overview")]
  public PriceOverview PriceOverview { get; set; } = new PriceOverview { Initial = 0 };
}
