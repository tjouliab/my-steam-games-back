namespace MySteamGamesBack.Data;

public class GenreEntity
{
    public required int AppId { get; set; }

    public required string Description { get; set; }

    public List<GameEntity> Games { get; set; } = [];
}