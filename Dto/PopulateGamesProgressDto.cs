namespace MySteamGamesBack.Dto;

public class PopulateGamesProgressDto
{
    public required ProgressStatusEnum Status { get; init; }
    public int? Processed { get; init; }
    public int? Total { get; init; }
    public double? Percent { get; init; }
}