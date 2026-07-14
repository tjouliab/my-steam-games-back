namespace MySteamGames.Core.Entities;

public class PopulateJobItemEntity
{
    public required int JobId { get; set; }
    public PopulateJobEntity? Job { get; set; }
    public required int AppId { get; set; }
    public required int ProgressStatusId { get; set; }
    public ProgressStatusEntity? ProgressStatus { get; set; }
    public required int Attempts { get; set; } = 0;
}