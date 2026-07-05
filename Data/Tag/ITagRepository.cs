namespace MySteamGamesBack.Data;

public interface ITagRepository :
    IGet<TagEntity>,
    IUpsert<TagEntity>
{ }