namespace MySteamGamesBack.Models;

public record SteamGameEnriched
{
  public required int AppId { get; set; }
  public required string Name { get; set; }
  public required int PlaytimeForever { get; set; }
  public required string ImgIconUrl { get; set; }
  public required bool HasCommunityVisibleStats { get; set; }
  public required int PlaytimeWindowsForever { get; set; }
  public required int PlaytimeMacForever { get; set; }
  public required int PlaytimeLinuxForever { get; set; }
  public required int PlaytimeDeckForever { get; set; }
  public required long RtimeLastPlayed { get; set; }
  public required int PlaytimeDisconnected { get; set; }
  public required ReleaseDate ReleaseDate { get; set; }
  public required Metacritic Metacritic { get; set; }
  public required List<Genre> Genres { get; set; }
  public required PriceOverview PriceOverview { get; set; }
  public required ReviewsSummary ReviewsSummary { get; set; }
}