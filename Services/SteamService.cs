using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using MySteamGamesBack.Dto;
using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public class SteamService(ILogger<SteamService> logger, IOptions<SteamOptions> options) : ISteamService
{
	private readonly ILogger<SteamService> _logger = logger;
	private readonly string _steamApiKey = options.Value.ApiKey ?? throw new InvalidOperationException("Steam API key is not configured.");
	private readonly IEnumerable<string> _familyPlayersId = options.Value.FamilyPlayersId ?? throw new InvalidOperationException("Steam Family players not configured.");

	private static readonly HttpClient client = new();

	public async Task<List<SteamGameOwnedDto>> GetPlayerGames(string playerId)
	{
		using HttpResponseMessage ownedGamesJson = await client.GetAsync($"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={_steamApiKey}&steamid={playerId}&include_appinfo=true&include_played_free_games=true");
		ownedGamesJson.EnsureSuccessStatusCode();

		var ownedGames = await ownedGamesJson.Content.ReadFromJsonAsync<SteamGamesOwnedResponse>();

		return ownedGames?.Response?.Games ?? [];
	}

	public async Task<SteamGameDetailsDto?> GetGameDetails(int AppId)
	{
		using HttpResponseMessage gameDetailsJson = await client.GetAsync($"https://store.steampowered.com/api/appdetails?appids={AppId}&cc=fr&l=french");
		gameDetailsJson.EnsureSuccessStatusCode();

		var gameDetailsContent = await gameDetailsJson.Content.ReadFromJsonAsync<Dictionary<string, SteamGameDetailsResponse>>();

		return gameDetailsContent?.Values.First().Data;
	}

	public async Task<SteamGameReviewsDto?> GetGameReviews(int AppId)
	{
		using HttpResponseMessage gameReviewsJson = await client.GetAsync($"https://store.steampowered.com/appreviews/{AppId}?language=all&purchase_type=all&json=1&num_per_page=0");
		gameReviewsJson.EnsureSuccessStatusCode();

		var gameReviewsContent = await gameReviewsJson.Content.ReadFromJsonAsync<SteamGameReviewsDto>();

		return gameReviewsContent;
	}

	public async Task<List<SteamGameEnriched>> GetFamilyGamesDistinct()
	{
		var tasks = _familyPlayersId.Select(GetPlayerGames);
		var results = await Task.WhenAll(tasks);

		List<SteamGameOwnedDto> familyGames = [.. results.SelectMany(games => games).DistinctBy(game => game.AppId)];

		return await EnrichPlayerGames(familyGames);
	}

	private async Task<List<SteamGameEnriched>> EnrichPlayerGames(List<SteamGameOwnedDto> games)
	{
		var enrichedGames = new List<SteamGameEnriched>();

		// Do not use Task.WhenAll on purpose to avoid flooding Steam API
		foreach (var game in games)
		{
			// If not enough informations, just ignore the game
			var gameDetails = await GetGameDetails(game.AppId);
			if (gameDetails == null) continue;

			var gameReviews = await GetGameReviews(game.AppId);
			if (gameReviews == null) continue;


			enrichedGames.Add(new SteamGameEnriched
			{
				AppId = game.AppId,
				Name = game.Name,
				PlaytimeForever = game.PlaytimeForever,
				ImgIconUrl = game.ImgIconUrl,
				RtimeLastPlayed = game.RtimeLastPlayed,
				ReleaseDate = gameDetails.ReleaseDate,
				Metacritic = gameDetails.Metacritic,
				Genres = gameDetails.Genres,
				PriceOverview = gameDetails.PriceOverview,
				ReviewsSummary = gameReviews.ReviewsSummary
			});
		}

		return enrichedGames;
	}
}
