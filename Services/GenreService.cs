using MySteamGamesBack.Data;
using MySteamGamesBack.Dto;

namespace MySteamGamesBack.Services;

public class GenreService : IGenreService
{
    public IEnumerable<GenreEntity> ConvertGenresToEntites(IEnumerable<GenreDto> genres, Dictionary<string, GenreEntity> genreCache)
    {
        List<GenreEntity> entities = [];

        foreach (var genre in genres)
        {
            genreCache.TryGetValue(genre.Id, out var entity);

            if (entity == null)
            {
                var isConverted = ConvertGenreToEntity(genre, out entity);
                // If convertion did not worked, just ignore the genre
                if (!isConverted) continue;

                genreCache.Add(genre.Id, entity);
            }

            entities.Add(entity);
        }

        return entities;
    }

    private static bool ConvertGenreToEntity(GenreDto genre, out GenreEntity entity)
    {
        var isConverted = int.TryParse(genre.Id, out var genreId);

        entity = new GenreEntity
        {
            AppId = genreId,
            Description = genre.Description,
        };

        return isConverted;
    }
}