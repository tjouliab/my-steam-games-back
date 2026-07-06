namespace MySteamGamesBack.Data;

public record GameEntity
{
    public required int AppId { get; set; }
    public required string Name { get; set; }
    public int VisibilityId { get; set; }
    public required VisibilityEntity Visibility { get; set; }
    public required string ImgIconUrl { get; set; }
    public int? MetacriticScore { get; set; }
    public required int PositiveReviews { get; set; }
    public required int NegativeReviews { get; set; }
    public required int PlayTime { get; set; }
    public DateTime? LastTimePlayed { get; set; }
    public required DateTime ReleaseDate { get; set; }
    public required int InitialPrice { get; set; }
    public List<GenreEntity> Genres { get; set; } = [];
    public List<TagEntity> Tags { get; set; } = [];

    public int? StatusId { get; set; }
    public StatusEntity? Status { get; set; }
    public int? PersonnalScore { get; set; }
    public string? PersonnalNotes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

}