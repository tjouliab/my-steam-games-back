namespace MySteamGamesBack.Data;

public class GenreEntity
{
    public required int AppId { get; set; }

    public required string Description { get; set; }

    public IEnumerable<GameEntity> Games { get; set; } = [];
}