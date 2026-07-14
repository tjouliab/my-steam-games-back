using MySteamGames.Core.Entities;
using MySteamGames.Core.Interfaces.Repositories.Helpers;

namespace MySteamGames.Core.Interfaces.Repositories;

public interface IGenreRepository :
    IGet<GenreEntity>,
    ITrackExisting<GenreEntity>
{ }