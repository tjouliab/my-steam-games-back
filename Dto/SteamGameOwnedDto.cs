using System.Text.Json.Serialization;

namespace MySteamGamesBack.Dto;

public class SteamGamesOwnedResponse
{
    [JsonPropertyName("response")]
    public required SteamGamesOwnedResponseBody Response { get; set; }
}

public class SteamGamesOwnedResponseBody
{
    [JsonPropertyName("game_count")]
    public int GameCount { get; set; }

    [JsonPropertyName("games")]
    public IEnumerable<SteamGameOwnedDto> Games { get; set; } = [];
}

public class SteamGameOwnedDto
{
    [JsonPropertyName("appid")]
    public int AppId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("playtime_forever")]
    public int PlaytimeForever { get; set; }

    [JsonPropertyName("img_icon_url")]
    public string ImgIconUrl { get; set; } = string.Empty;

    [JsonPropertyName("rtime_last_played")]
    public long RtimeLastPlayed { get; set; }
}