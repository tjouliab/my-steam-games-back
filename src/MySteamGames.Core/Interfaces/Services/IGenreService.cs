using MySteamGames.Core.Dto;
using MySteamGames.Core.Entities;

namespace MySteamGames.Core.Interfaces.Services;

public interface IGenreService {
    IEnumerable<GenreEntity> ConvertGenresToEntites(IEnumerable<GenreDto> genres, Dictionary<string, GenreEntity> genreCache);
}