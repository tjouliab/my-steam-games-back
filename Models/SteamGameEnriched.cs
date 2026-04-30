using MySteamGamesBack.Dto;

namespace MySteamGamesBack.Models;

public record SteamGameEnriched
{
    public required int AppId { get; set; }
    public required string Name { get; set; }
    public required int PlaytimeForever { get; set; }
    public required string ImgIconUrl { get; set; }
    public required long RtimeLastPlayed { get; set; }
    public required ReleaseDateDto ReleaseDate { get; set; }
    public required MetacriticDto Metacritic { get; set; }
    public required List<GenreDto> Genres { get; set; }
    public required PriceOverviewDto PriceOverview { get; set; }
    public required ReviewsSummaryDto ReviewsSummary { get; set; }
}