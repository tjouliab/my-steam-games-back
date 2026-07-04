using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using MySteamGamesBack.Dto;
using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public class SteamService(IOptions<SteamOptions> options) : ISteamService
{
	private readonly string _steamApiKey = options.Value.ApiKey ?? throw new InvalidOperationException("Steam API key is not configured.");

	private static readonly HttpClient client = new();

	public async Task<IEnumerable<SteamGameOwnedDto>> GetPlayerGames(string playerId)
	{
		using HttpResponseMessage ownedGamesJson = await client.GetAsync($"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key={_steamApiKey}&steamid={playerId}&include_appinfo=true&include_played_free_games=true");
		ownedGamesJson.EnsureSuccessStatusCode();

		var ownedGames = await ownedGamesJson.Content.ReadFromJsonAsync<SteamGamesOwnedResponse>();

		return ownedGames?.Response?.Games ?? [];
	}

	public async Task<SteamGameDetailsDto?> GetGameDetails(int AppId)
	{
		using HttpResponseMessage gameDetailsFRJson = await client.GetAsync($"https://store.steampowered.com/api/appdetails?appids={AppId}&cc=fr&l=french");
		using HttpResponseMessage gameDetailsENJson = await client.GetAsync($"https://store.steampowered.com/api/appdetails?appids={AppId}&cc=en&l=english");

		gameDetailsFRJson.EnsureSuccessStatusCode();
		gameDetailsENJson.EnsureSuccessStatusCode();

		var gameDetailsFRContent = await gameDetailsFRJson.Content.ReadFromJsonAsync<Dictionary<string, SteamGameDetailsResponse>>();
		var gameDetailsENContent = await gameDetailsENJson.Content.ReadFromJsonAsync<Dictionary<string, SteamGameDetailsResponse>>();

		var gameDetailsFR = gameDetailsFRContent?.Values.First()?.Data;
		var gameDetailsEN = gameDetailsENContent?.Values.First()?.Data;

		if (gameDetailsFR == null || gameDetailsEN == null) return null;

		return new SteamGameDetailsDto
		{
			ReleaseDate = gameDetailsEN.ReleaseDate, // Release date "aout" is not parsed properly in FR
			Metacritic = gameDetailsFR.Metacritic,
			Genres = gameDetailsFR.Genres,
			PriceOverview = gameDetailsFR.PriceOverview,
		};
	}

	public async Task<SteamGameReviewsDto?> GetGameReviews(int AppId)
	{
		using HttpResponseMessage gameReviewsJson = await client.GetAsync($"https://store.steampowered.com/appreviews/{AppId}?language=all&purchase_type=all&json=1&num_per_page=0");
		gameReviewsJson.EnsureSuccessStatusCode();

		var gameReviewsContent = await gameReviewsJson.Content.ReadFromJsonAsync<SteamGameReviewsDto>();

		return gameReviewsContent;
	}

	public async Task<IEnumerable<Achievement>> GetPlayerAchievements(string playerId, int AppId)
	{
		using HttpResponseMessage playerAchievementsJson = await client.GetAsync($"https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key={_steamApiKey}&steamid={playerId}&appid={AppId}");

		var playerAchievementsContent = await playerAchievementsJson.Content.ReadFromJsonAsync<SteamPlayerAchiementsDto>();

		return playerAchievementsContent?.PlayerStats?.Achievements ?? [];
	}
}
