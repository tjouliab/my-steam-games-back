
using MySteamGames.Core.Dto;

namespace MySteamGames.Core.Interfaces.Services;

public interface ISteamService
{
	Task<IEnumerable<SteamGameOwnedDto>> GetPlayerGames(string playerId);

	Task<SteamGameDetailsDto?> GetGameDetails(int AppId);

	Task<SteamGameReviewsDto?> GetGameReviews(int AppId);

	Task<IEnumerable<Achievement>> GetPlayerAchievements(string playerId, int AppId);
}
