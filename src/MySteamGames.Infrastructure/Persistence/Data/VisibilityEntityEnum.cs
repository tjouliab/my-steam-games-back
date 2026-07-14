using MySteamGames.Core.Entities;

namespace MySteamGames.Infrastructure.Persistence.Data;

// No need for a Repository since the Visibility states should not change over time
public static class VisibilityEntityEnum
{
    public static readonly VisibilityEntity Visible = new()
    {
        Id = 1,
        Label = "Visible"
    };

    public static readonly VisibilityEntity HiddenManually = new()
    {
        Id = 2,
        Label = "Hidden Manually"
    };

    public static readonly VisibilityEntity HiddenDefault = new()
    {
        Id = 3,
        Label = "Hidden Default"
    };
}