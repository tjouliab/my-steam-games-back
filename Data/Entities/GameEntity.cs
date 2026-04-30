namespace MySteamGamesBack.Data.Entities;

public record GameEntity
{
    public required int AppId { get; set; }
    public required string Name { get; set; }
    public required bool IsVisible { get; set; } = true;
    public required string ImgIconUrl { get; set; }
    public required int MetacriticScore { get; set; }
    public required int PositiveReviews { get; set; }
    public required int NegativeReviews { get; set; }
    public required int PlayTime { get; set; }
    public required DateTime LastTimePlayed { get; set; }
    public required DateTime ReleaseDate { get; set; }
    public required int InitialPrice { get; set; }
    public List<GameGenreEntity> GameGenres { get; set; } = [];

    public int? StatusId { get; set; }
    public StatusEntity? Status { get; set; }
    public int? PersonnalScore { get; set; }
    public string? PersonnalNotes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

}