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

    public async Task PopulateGamesTable(Func<int, int, int, Task> onProgress, CancellationToken cancellationToken)
    {
        var familyGames = (await GetFamilyGamesDistinct()).ToList();

        await UpsertGamesSequential(familyGames, onProgress, cancellationToken);
    }

    private async Task<IEnumerable<SteamGameOwnedDto>> GetFamilyGamesDistinct()
    {
        var tasks = _familyPlayersId.Select(_steamService.GetPlayerGames);
        var results = await Task.WhenAll(tasks);

        return [.. results.SelectMany(games => games).DistinctBy(game => game.AppId)];
    }

    private async Task UpsertGamesSequential(
        List<SteamGameOwnedDto> games,
        Func<int, int, int, Task> onProgress,
        CancellationToken cancellationToken)
    {
        Dictionary<string, GenreEntity> genreCache = [];

        // Websocket init
        var total = games.Count;
        var watch = System.Diagnostics.Stopwatch.StartNew();
        var timeTaken = 0;
        var processed = 0;

        // Do not use Task.WhenAll on purpose to avoid flooding Steam API
        foreach (var game in games)
        {
            cancellationToken.ThrowIfCancellationRequested();

            // If not enough informations, just ignore the game
            var details = await _steamService.GetGameDetails(game.AppId);
            if (details == null) continue;

            var reviews = await _steamService.GetGameReviews(game.AppId);
            if (reviews == null) continue;

            var achievements = await _steamService.GetPlayerAchievements(_playerId, game.AppId);

            var entity = ConvertGameToEntity(game, details, reviews, achievements, genreCache);

            await _gameRepository.Upsert(entity);

            // Websocket progress
            timeTaken += (int)watch.ElapsedMilliseconds;
            processed++;
            await onProgress(processed, total, timeTaken);
        }
    }

    private GameEntity ConvertGameToEntity(
        SteamGameOwnedDto game,
        SteamGameDetailsDto details,
        SteamGameReviewsDto reviews,
        IEnumerable<Achievement> achievements,
        Dictionary<string, GenreEntity> genreCache)
    {
        var genreEntities = _genreService.ConvertGenresToEntites(details.Genres, genreCache);

        DateTime? lastTimePlayed = game.RtimeLastPlayed.HasValue
            ? DateTimeOffset.FromUnixTimeSeconds(game.RtimeLastPlayed.Value).UtcDateTime
            : null;

        var isCompleted = achievements.All(a => a.Achieved == 1);

        var hasBeenStarted = game.PlaytimeForever > 0;

        return new GameEntity
        {
            AppId = game.AppId,
            Name = game.Name,
            VisibilityId = hasBeenStarted ? VisibilityEnum.Visible.Id : VisibilityEnum.HiddenDefault.Id,
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