namespace MySteamGamesBack.Data;

public interface IGenreRepository :
    IGet<GenreEntity>,
    ITrackExisting<GenreEntity>
{ }