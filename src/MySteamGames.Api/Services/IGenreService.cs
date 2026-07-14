using MySteamGamesBack.Data;
using MySteamGamesBack.Dto;

namespace MySteamGamesBack.Services;

public interface IGenreService {
    IEnumerable<GenreEntity> ConvertGenresToEntites(IEnumerable<GenreDto> genres, Dictionary<string, GenreEntity> genreCache);
}