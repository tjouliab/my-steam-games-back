namespace MySteamGamesBack.Data;

public class TagEntity
{
    public required int Id { get; set; }
    public required string Label { get; set; }
    public IEnumerable<GameEntity> Games { get; set; } = [];
}