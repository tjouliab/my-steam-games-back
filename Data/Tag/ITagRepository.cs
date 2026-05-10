namespace MySteamGamesBack.Data;

public interface ITagRepository :
    IGet<TagEntity>,
    ISave<TagEntity>
{ }