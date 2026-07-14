namespace MySteamGamesBack.Data;

public class TagEntity
{
    public required int Id { get; set; }
    public required string Label { get; set; }
    public List<GameEntity> Games { get; set; } = [];
}