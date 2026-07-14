using MySteamGames.Core.Entities;

namespace MySteamGames.Core.Interfaces.Repositories;

public interface IGenreRepository :
    IGet<GenreEntity>,
    ITrackExisting<GenreEntity>
{ }