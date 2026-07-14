using System.Text.Json.Serialization;

namespace MySteamGames.Core.Dto;

public class GenreDto
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("description")]
    public required string Description { get; set; }
}