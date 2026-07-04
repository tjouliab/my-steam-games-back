using Microsoft.Extensions.Options;
using MySteamGamesBack.Data;
using MySteamGamesBack.Dto;
using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public class GameService(
    IOptions<SteamOptions> options,
    IGameRepository gameRepository,
    ISteamService steamService,
    IGenreService genreService
) : IGameService
{
    private readonly string _playerId = options.Value.PlayerId ?? throw new InvalidOperationException("Player not configured.");
    private readonly IEnumerable<string> _familyPlayersId = options.Value.FamilyPlayersId ?? throw new InvalidOperationException("Steam Family players not configured.");
    private readonly IGameRepository _gameRepository = gameRepository;
    private readonly ISteamService _steamService = steamService;
    private readonly IGenreService _genreService = genreService;

    public async Task PopulateGamesTable()
    {
        var familyGames = await GetFamilyGamesDistinct();

        var entities = await ConvertGamesToEntities(familyGames);

        await _gameRepository.Save(entities);
    }

    private async Task<IEnumerable<SteamGameOwnedDto>> GetFamilyGamesDistinct()
    {
        var tasks = _familyPlayersId.Select(_steamService.GetPlayerGames);
        var results = await Task.WhenAll(tasks);

        return [.. results.SelectMany(games => games).DistinctBy(game => game.AppId)];
    }

    private async Task<IEnumerable<GameEntity>> ConvertGamesToEntities(IEnumerable<SteamGameOwnedDto> games)
    {
        var entities = new List<GameEntity>();
        Dictionary<string, GenreEntity> genreCache = [];

        // Do not use Task.WhenAll on purpose to avoid flooding Steam API
        foreach (var game in games)
        {
            // If not enough informations, just ignore the game
            var details = await _steamService.GetGameDetails(game.AppId);
            if (details == null) continue;

            var reviews = await _steamService.GetGameReviews(game.AppId);
            if (reviews == null) continue;

            var achievements = await _steamService.GetPlayerAchievements(_playerId, game.AppId);

            entities.Add(ConvertGameToEntity(game, details, reviews, achievements, genreCache));
        }

        return entities;
    }

    private GameEntity ConvertGameToEntity(
        SteamGameOwnedDto game,
        SteamGameDetailsDto details,
        SteamGameReviewsDto reviews,
        IEnumerable<Achievement> achievements,
        Dictionary<string, GenreEntity> genreCache)
    {
        var genreEntities = _genreService.ConvertGenresToEntites(details.Genres, genreCache);

        var lastTimePlayed = DateTimeOffset
            .FromUnixTimeSeconds(game.RtimeLastPlayed)
            .UtcDateTime;

        var isCompleted = achievements.All(a => a.Achieved == 1);

        return new GameEntity
        {
            AppId = game.AppId,
            Name = game.Name,
            IsVisible = game.PlaytimeForever > 0,
            ImgIconUrl = game.ImgIconUrl,
            MetacriticScore = details.Metacritic?.Score ?? null,
            PositiveReviews = reviews.ReviewsSummary.TotalPositive,
            NegativeReviews = reviews.ReviewsSummary.TotalNegative,
            PlayTime = game.PlaytimeForever,
            LastTimePlayed = lastTimePlayed,
            ReleaseDate = DateTime.Parse(details.ReleaseDate.Date),
            InitialPrice = details.PriceOverview.Initial,
            StatusId = isCompleted ? StatusesEnum.Completed.Id : null,
            Genres = genreEntities?.ToList() ?? [],
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }
}