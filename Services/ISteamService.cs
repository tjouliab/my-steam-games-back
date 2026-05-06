using MySteamGamesBack.Dto;

namespace MySteamGamesBack.Services;

public interface ISteamService
{
	Task<IEnumerable<SteamGameOwnedDto>> GetPlayerGames(string playerId);

	Task<SteamGameDetailsDto?> GetGameDetails(int AppId);

	Task<SteamGameReviewsDto?> GetGameReviews(int AppId);
}
