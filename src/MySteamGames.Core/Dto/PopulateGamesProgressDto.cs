using MySteamGames.Core.Enum;

namespace MySteamGames.Core.Dto;

public class PopulateGamesProgressDto
{
    public required ProgressStatusEnum Status { get; init; }
    public int? Processed { get; init; }
    public int? Total { get; init; }
    public double? Percent { get; init; }
    public int? TimeTaken { get; init; }
    public int? TimeRemaining { get; init; }
}