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

	public async Task<IEnumerable<Achievement>> GetPlayerAchievements(string playerId, int AppId)
	{
		using HttpResponseMessage playerAchievementsJson = await client.GetAsync($"https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?key={_steamApiKey}&steamid={playerId}&appid={AppId}");
		playerAchievementsJson.EnsureSuccessStatusCode();

		var playerAchievementsContent = await playerAchievementsJson.Content.ReadFromJsonAsync<SteamPlayerAchiementsDto>();

		return playerAchievementsContent?.PlayerStats?.Achievements ?? [];
	}
}
