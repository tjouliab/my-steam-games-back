namespace MySteamGamesBack.Data.Entities;

public class GenreEntity
{
    public required int Id { get; set; }

    public required string Description { get; set; }

    public List<GameGenreEntity> GameGenres { get; set; } = [];
}