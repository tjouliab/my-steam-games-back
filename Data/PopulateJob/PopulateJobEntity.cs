namespace MySteamGamesBack.Data;

public class PopulateJobEntity
{
    public required int Id { get; set; }
    public required int ProgressStatusId { get; set; }
    public ProgressStatusEntity? ProgressStatus { get; set; }
    public required DateTime StartAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public required int TotalGames { get; set; }
    public required int FailedGames { get; set; } = 0;

    public List<PopulateJobItemEntity> JobItems { get; set; } = [];

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}