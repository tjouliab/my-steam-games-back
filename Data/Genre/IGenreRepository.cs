namespace MySteamGamesBack.Data;

public interface IGenreRepository :
    IGet<GenreEntity>,
    ISave<GenreEntity>
{ }