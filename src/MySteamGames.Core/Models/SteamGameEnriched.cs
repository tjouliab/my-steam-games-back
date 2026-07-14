

using MySteamGames.Core.Dto;

namespace MySteamGames.Core.Models;

public record SteamGameEnriched
{
    public required int AppId { get; set; }
    public required string Name { get; set; }
    public required int PlaytimeForever { get; set; }
    public required string ImgIconUrl { get; set; }
    public required long RtimeLastPlayed { get; set; }
    public required ReleaseDateDto ReleaseDate { get; set; }
    public required MetacriticDto Metacritic { get; set; }
    public required IEnumerable<GenreDto> Genres { get; set; }
    public required PriceOverviewDto PriceOverview { get; set; }
    public required ReviewsSummaryDto ReviewsSummary { get; set; }
}