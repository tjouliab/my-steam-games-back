using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MySteamGamesBack.Dto;
using MySteamGamesBack.Services;

namespace MySteamGamesBack.Controllers;

[ApiController]
[Route("steam")]
public class GameController(IGameService gameService) : ControllerBase
{
    private readonly IGameService _gameService = gameService;

    [HttpGet("populate-games-table")]
    public async Task PopulateGamesTable(CancellationToken cancellationToken)
    {
        if (!HttpContext.WebSockets.IsWebSocketRequest)
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            return;
        }

        using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();

        await _gameService.PopulateGamesTable(
            async (processed, total, timeTaken) =>
            {
                double percent = total == 0
                    ? 100
                    : processed * 100d / total;

                int timeRemaining = processed == 0 
                    ? 0 
                    : (total - processed) * timeTaken / processed;

                await SendJson(webSocket, new PopulateGamesProgressDto
                {
                    Status = ProgressStatusEnum.Progress,
                    Processed = processed,
                    Total = total,
                    Percent = percent,
                    TimeTaken = timeTaken,
                    TimeRemaining = timeRemaining
                }, cancellationToken);
            },
            cancellationToken);

        await SendJson(webSocket, new PopulateGamesProgressDto
        {
            Status = ProgressStatusEnum.Completed
        }, cancellationToken);

        await webSocket.CloseAsync(
            WebSocketCloseStatus.NormalClosure,
            "Completed",
            cancellationToken);
    }

    private static async Task SendJson(
        WebSocket webSocket,
        PopulateGamesProgressDto payload,
        CancellationToken cancellationToken)
    {
        var json = JsonSerializer.Serialize(payload);

        var bytes = Encoding.UTF8.GetBytes(json);

        await webSocket.SendAsync(
            bytes,
            WebSocketMessageType.Text,
            endOfMessage: true,
            cancellationToken);
    }
}
