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
  public List<SteamGameOwnedDto> Games { get; set; } = [];
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

  [JsonPropertyName("has_community_visible_stats")]
  public bool HasCommunityVisibleStats { get; set; }

  [JsonPropertyName("playtime_windows_forever")]
  public int PlaytimeWindowsForever { get; set; }

  [JsonPropertyName("playtime_mac_forever")]
  public int PlaytimeMacForever { get; set; }

  [JsonPropertyName("playtime_linux_forever")]
  public int PlaytimeLinuxForever { get; set; }

  [JsonPropertyName("playtime_deck_forever")]
  public int PlaytimeDeckForever { get; set; }

  [JsonPropertyName("rtime_last_played")]
  public long RtimeLastPlayed { get; set; }

  [JsonPropertyName("playtime_disconnected")]
  public int PlaytimeDisconnected { get; set; }
}