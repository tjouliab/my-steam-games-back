using MySteamGames.Core.Entities;

namespace MySteamGames.Infrastructure.Persistence.Data;

// No need for a Repository since the Statuses should not change over time
public static class StatusEntityEnum
{
    public static readonly StatusEntity Completed = new()
    {
        Id = 1,
        Label = "100%"
    };

    public static readonly StatusEntity Finished = new()
    {
        Id = 2,
        Label = "Finished"
    };

    public static readonly StatusEntity Unfinished = new()
    {
        Id = 3,
        Label = "Unfinished"
    };

    public static readonly StatusEntity Abandoned = new()
    {
        Id = 4,
        Label = "Abandoned"
    };
}