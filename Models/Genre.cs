using System.Text.Json.Serialization;

namespace MySteamGamesBack.Models;

public class Genre
{
  [JsonPropertyName("id")]
  public required string Id { get; set; }

  [JsonPropertyName("description")]
  public required string Description { get; set; }
}