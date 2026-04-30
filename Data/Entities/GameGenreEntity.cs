namespace MySteamGamesBack.Data.Entities;

public class GameGenreEntity
{
    public required int AppId { get; set; }
    public required GameEntity Game { get; set; }

    public required int GenreId;
    public required GenreEntity Genre { get; set; }
}