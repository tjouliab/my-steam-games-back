using MySteamGames.Core.Entities;

namespace MySteamGames.Core.Interfaces.Repositories;

public interface ITagRepository :
    IGet<TagEntity>,
    ITrackExisting<TagEntity>
{ }