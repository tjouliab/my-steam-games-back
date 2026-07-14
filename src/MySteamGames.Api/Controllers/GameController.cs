using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MySteamGames.Core.Dto;
using MySteamGames.Core.Enum;
using MySteamGames.Core.Interfaces.Services;

namespace MySteamGames.Api.Controllers;

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
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        var receiveLoopTask = ReceiveLoopAsync(webSocket, linkedCts);

        try
        {
            await _gameService.PopulateGamesTable(
                async (processed, total, timeTaken) =>
                {
                    if (webSocket.State != WebSocketState.Open) return;

                    double percent = total == 0
                        ? 100
                        : processed * 100d / total;

                    int timeRemaining = processed == 0
                        ? 0
                        : (total - processed) * timeTaken / processed;

                    await SendJson(webSocket, new PopulateGamesProgressDto
                    {
                        Status = ProgressStatusEnum.Running,
                        Processed = processed,
                        Total = total,
                        Percent = percent,
                        TimeTaken = timeTaken,
                        TimeRemaining = timeRemaining
                    }, linkedCts.Token);
                },
                linkedCts.Token);

            if (webSocket.State == WebSocketState.Open)
            {
                await SendJson(webSocket, new PopulateGamesProgressDto
                {
                    Status = ProgressStatusEnum.Completed
                }, CancellationToken.None);

                await webSocket.CloseAsync(
                    WebSocketCloseStatus.NormalClosure,
                    "Completed",
                    CancellationToken.None);
            }
        }
        catch (OperationCanceledException)
        {
            if (webSocket.State == WebSocketState.Open || webSocket.State == WebSocketState.CloseReceived)
            {
                try
                {
                    await webSocket.CloseAsync(
                        WebSocketCloseStatus.EndpointUnavailable,
                        "Canceled",
                        CancellationToken.None);
                }
                catch
                {
                    // Ignored: the socket is already closed or aborted.
                }
            }
        }
        finally
        {
            try
            {
                await receiveLoopTask;
            }
            catch
            {
                // Ignore errors from the receive loop once cancellation is requested.
            }
        }
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

    private static async Task ReceiveLoopAsync(WebSocket webSocket, CancellationTokenSource linkedCts)
    {
        var buffer = new byte[1024];

        while (!linkedCts.IsCancellationRequested && webSocket.State == WebSocketState.Open)
        {
            try
            {
                var result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    linkedCts.Cancel();
                    return;
                }
            }
            catch (WebSocketException)
            {
                linkedCts.Cancel();
                return;
            }
            catch (OperationCanceledException)
            {
                return;
            }
        }
    }
}
