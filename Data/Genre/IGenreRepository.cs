namespace MySteamGamesBack.Data;

public interface IGenreRepository :
    IGet<GenreEntity>,
    IUpsert<GenreEntity>
{ }