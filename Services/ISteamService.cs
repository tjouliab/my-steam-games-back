using MySteamGamesBack.Dto;
using MySteamGamesBack.Models;

namespace MySteamGamesBack.Services;

public interface ISteamService
{
	Task<List<SteamGameOwnedDto>> GetPlayerGames(string playerId);

	Task<SteamGameDetailsDto?> GetGameDetails(int AppId);

	Task<SteamGameReviewsDto?> GetGameReviews(int AppId);

	Task<List<SteamGameEnriched>> GetFamilyGamesDistinct();
}
