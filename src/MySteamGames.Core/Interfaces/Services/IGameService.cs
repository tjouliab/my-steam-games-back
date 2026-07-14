namespace MySteamGames.Core.Interfaces.Services;

public interface IGameService
{
    Task PopulateGamesTable(Func<int, int, int, Task> onProgress, CancellationToken cancellationToken);
}
