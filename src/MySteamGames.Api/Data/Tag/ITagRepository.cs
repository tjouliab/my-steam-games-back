namespace MySteamGamesBack.Data;

public interface ITagRepository :
    IGet<TagEntity>,
    ITrackExisting<TagEntity>
{ }