using MySteamGames.Core.Entities;
using MySteamGames.Core.Enum;

namespace MySteamGames.Infrastructure.Persistence.Data;

// No need for a Repository since the ProgressStatus should not change over time
public class ProgressStatusEntityEnum
{
    public static readonly ProgressStatusEntity Pending = new()
    {
        Id = (int)ProgressStatusEnum.Pending,
        Label = nameof(ProgressStatusEnum.Pending)
    };

    public static readonly ProgressStatusEntity Running = new()
    {
        Id = (int)ProgressStatusEnum.Running,
        Label = nameof(ProgressStatusEnum.Running)
    };

    public static readonly ProgressStatusEntity Completed = new()
    {
        Id = (int)ProgressStatusEnum.Completed,
        Label = nameof(ProgressStatusEnum.Completed)
    };

    public static readonly ProgressStatusEntity Failed = new()
    {
        Id = (int)ProgressStatusEnum.Failed,
        Label = nameof(ProgressStatusEnum.Failed)
    };

    public static readonly ProgressStatusEntity Canceled = new()
    {
        Id = (int)ProgressStatusEnum.Canceled,
        Label = nameof(ProgressStatusEnum.Canceled)
    };
}